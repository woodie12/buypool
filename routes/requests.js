const express = require('express');
const router = express.Router();
const config = require('../config.js');
const connection = require('../connection');
const transporter = require('../email');

// pool add a user
// money_need minus
router.put('/join/:requestId', function(req,res){
  console.log("REQUEST API: user join a request")
  const requestId = req.params.requestId;
  const userId = req.body.userId;
  const amount = req.body.amount;
  connection.acquire(function(err, con){
    con.query('SELECT pool,userId,completed,current,total FROM Request WHERE requestId = ?', requestId,
      function(err, result) {
        if (err || result.length == 0 ){
          console.log("REQUEST API: "+err.message);
          res.status(404).send(err.message);
        }else{
          let pool = JSON.parse(result[0].pool);

          if(pool.includes(userId)){

              res.status(400).send("User already joined this request");

          } else if(result[0].completed==1){
            res.status(400).send("Request already closed.");
          } else{
            const current = result[0].current+amount;
            pool.push(userId);
            con.query('UPDATE Request SET pool = ?, current = ? WHERE requestId = ?',
              [JSON.stringify(pool), current,requestId],
              function(err, result) {
                if (err){
                  console.log("REQUEST API: "+err.message);
                  res.send(err);
                }else{
                  console.log("Join request successfully.");
                  res.status(200).send("Join request successfully.");
                }
              });

            // send email
            const total = result[0].total;
            let query = 'SELECT email FROM User WHERE userId = '+[result[0].userId];
            pool.forEach(userId =>{
              query += ' OR userId = '+userId
            });
            console.log(query);
            con.query(query,
              function(err, result){
                if (err ){
                  console.log("Find user: "+err.message);
                } else if (result.length == 0){
                  console.log("Find user: No user ");
                } else{
                  let emailList = '';
                  result.forEach(item => {
                    emailList += item.email+',';
                  });
                  console.log(emailList);

                  // send email
                  const mailOptions = {
                    from: 'zhangyu9610@gmail.com',
                    to: emailList,
                    subject: 'BUYPOOL: '+ current >= total ? 'The request minimum is reached!' :'One more user joined your request!',
                    text: 'You get closer to your order!'
                  };

                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
                }
              });
          }
        }
        con.release();
      });
  });
});

// user close and ship a request
router.put('/close/:requestId', function(req,res){
  console.log("REQUEST API: owner close and ship a request")
  const requestId = req.params.requestId;
  // close request
  connection.acquire(function(err, con){
    con.query('UPDATE Request SET completed = 1 WHERE requestId = ?', requestId,
      function(err, result) {
        if (err){
          console.log("REQUEST API: "+err);
          res.send(err);
        }else{
          console.log("Close request successfully.");
          res.status(200).send("Close request successfully.");
        }
      });

    // TODO send notification to all users
    con.query('SELECT pool,userId,total,current FROM Request WHERE requestId = ?', requestId,
      function(err, result) {
        if (err){
          console.log("Find request: "+err.message);
        } else if (result.length == 0){
          console.log("Find request: No requestId "+ requestId);
        } else{
          let pool = JSON.parse(result[0].pool);
          const total = result[0].total;
          const current = result[0].current;

          let query = 'SELECT email FROM User WHERE userId = '+[result[0].userId];
          pool.forEach(userId =>{
            query += ' OR userId = '+userId
          });

          console.log(query)

          con.query(query,
            function(err, result){
              con.release();
              if (err ){
                console.log("Find user: "+err.message);
              } else if (result.length == 0){
                console.log("Find user: No user ");
              } else{
                let emailList = '';
                result.forEach(item => {
                  emailList += item.email+',';
                });
                console.log(emailList);

                // send email
                const mailOptions = {
                  from: 'zhangyu9610@gmail.com',
                  to: emailList,
                  subject: 'BUYPOOL: Your pool request has been '+current>=total?'completed!':'closed.',
                  text: current>=total?'You can now make an order together!':'THe request is dropped, look at more requests.'
                };

                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });
              }
            });
        }
      });
  });
});


router.get('/', function(req, res) {
  console.log("REQUEST API: get list requests")
  connection.acquire(function(err, con){
    con.query('SELECT * FROM Request', function(err, result) {
        con.release();
        if (err){
          res.send(err);
        }else{
          res.send(result);
        }
      });
  });
});

router.get('/category', function(req, res) {
  console.log("REQUEST API: aggregate list requests")
  connection.acquire(function(err, con){
    con.query('SELECT type,COUNT(*),requestId FROM Request GROUP BY type',
      function(err, result) {
        con.release();
        if (err){
          res.send(err);
        }else{
          res.send(result);
        }
      });
  });
});

// give recommendation request to a user
router.get('/recommendation/:id', function(req, res) {
  console.log("REQUEST API: aggregate list requests")
  connection.acquire(function(err, con){
    con.query(
      ' SELECT * FROM Request AS r\
        INNER JOIN\
          (SELECT type FROM Request\
            WHERE userId = ?\
            GROUP BY type ORDER BY COUNT(type) DESC LIMIT 2) AS r1\
        ON r.type = r1.type\
        INNER JOIN\
          (SELECT url FROM Request\
            WHERE userId = ?\
            GROUP BY url ORDER BY count(url) DESC LIMIT 2) AS r2\
        ON r.url = r2.url\
        WHERE completed = 0 AND userId <> ?',
      [req.params.id,req.params.id,req.params.id],
      function(err, result) {
        con.release();
        if (err){
          res.send(err);
        }else{
          res.send(result);
        }
      });
  });
});


// used for filtering requests
// search by address, completed, type, userId, url (xxxx or %)
// TODO OR (frontend gives a list of value for each attribute)
router.get('/search', function(req, res) {
  console.log("REQUEST API: search request by attributes")
  connection.acquire(function(err, con){
    let isFirst = true;
    let search_query;
    if (req.query.advanced){
      search_query = ' SELECT * FROM Request, User WHERE Request.userId = User.userId ';
      isFirst = false;
    }else{
      search_query = ' SELECT * FROM Request WHERE ';
    };
    // TODO search on difference
    if (req.query.difference){
      if (!isFirst) {search_query += ' AND '};
      search_query += ' total-current <= "'+req.query.difference+'" ';
      isFirst = false;
    };
    if (req.query.address){
      if (!isFirst) {search_query += ' AND '};
      search_query += ' address = "'+req.query.address+'" ';

      isFirst = false;
    };
    if (req.query.completed){
      if (!isFirst) {search_query += ' AND '};
      search_query += ' completed = '+req.query.completed;
      isFirst = false;
    };
    if (req.query.type){
      if (!isFirst) {search_query += ' AND '};
      search_query += ' type = "'+ req.query.type+'" ';
      isFirst = false;
    };
    if (req.query.userId){
      if (!isFirst) {search_query += ' AND '};
      search_query += ' Request.userId = "'+req.query.userId+'" ';
      isFirst = false;
    };
    if (req.query.url){
      if (!isFirst) {search_query += ' AND '};
      search_query += 'url = "'+req.query.url+'" ';
      isFirst = false;
    };
    if (req.query.title){
      if (!isFirst) {search_query += ' AND '};
      search_query += 'title LIKE "%'+req.query.title+'%" ';
      isFirst = false;
    };
    if (req.query.description){
      if (!isFirst) {search_query += ' AND '};
      search_query += 'description LIKE "%'+req.query.description+'%" ';
      isFirst = false;
    };
    if (req.query.username){
      search_query += ' AND User.username LIKE "%'+req.query.username+'%" ';
    };
    if (req.query.min_rating){
      search_query += ' AND User.rating >= '+req.query.min_rating+' ';
    };
    console.log(search_query);
    con.query(search_query,
      function(err, result) {
        con.release();
        if (err){
          res.send(err);
        }else{
          res.send(result);
        }
      });
  });
});


// used for the page of a single request with username
router.get('/:id', function(req, res) {
  console.log("REQUEST API: get request by id")
  connection.acquire(function(err, con){
    con.query('SELECT * FROM Request WHERE requestId = ?', req.params.id,
      function(err, result) {
        if (err){
          res.send(err);
        }else{
          let request = result[0];
          con.query('SELECT username FROM User WHERE userId = ?', request.userId,
            function(err, username){
              if (err){
                res.send(err);
              }else{
                Object.assign(request, {username: username[0].username });
                res.send(result);
              }
            });
        }
        con.release();
      });
  });
});

// INSERT INTO table SET a=1, b=2, c=3
// need json in req.body
router.post('/', function(req, res) {
  console.log("REQUEST API: post new request")
  connection.acquire(function(err, con) {
    console.log(req.body)
    con.query(
      `INSERT INTO Request
      (requestId,url,completed,title,type,address,description,userId,total,current)
      VALUES (?,?,?,?,?,?,?,?,?,?) `,
    [req.body.requestId, req.body.url, req.body.completed, req.body.title,
      req.body.type, req.body.address, req.body.description, req.body.userId,
      req.body.total,req.body.current],
      function(err, result) {

        con.release();
        if (err) {
          res.send(err);
        } else {


          res.send({
            status: 200,
            message: 'Insert to Request successfully.'
          });
        }
      });
  });
});

router.put('/:id', function(req, res) {
  connection.acquire(function(err, con) {
    console.log("REQUEST API: update request")
    let update_query = ' UPDATE Request SET ';
    let isFirst = true;

    if (req.body.address){
      if (!isFirst) {update_query += ' , '};
      update_query += ' address = "'+req.body.address+'" ';
      isFirst = false;
    };
    if (req.body.completed){
      if (!isFirst) {update_query += ' , '};
      update_query += ' completed = '+req.body.completed;
      isFirst = false;
    };
    if (req.body.type){
      if (!isFirst) {update_query += ' , '};
      update_query += ' type = "'+ req.body.type+'" ';
      isFirst = false;
    };
    if (req.body.url){
      if (!isFirst) {update_query += ' , '};
      update_query += 'url = "'+req.body.url+'" ';
      isFirst = false;
    };
    if (req.body.title){
      if (!isFirst) {update_query += ' , '};
      update_query += 'title = "'+req.body.title+'" ';
      isFirst = false;
    };
    if (req.body.description){
      if (!isFirst) {update_query += ' , '};
      update_query += 'description = "'+req.body.description+'" ';
      isFirst = false;
    };
    if (req.body.total){
      if (!isFirst) {update_query += ' , '};
      update_query += 'total = "'+req.body.total+'" ';
      isFirst = false;
    };

    if (isFirst){
      res.send({
        status: 200,
        message: 'Update Request successfully'
      });
    } else {
      update_query += ' WHERE requestId = ? ';

      con.query(update_query, req.params.id,
        function(err, result) {
          con.release();
          if (err) {
            res.send(err);
          } else {
            res.send({
              status: 200,
              message: 'Update Request successfully'
            });
          }
        });
    }
  });
});

router.delete('/:id', function(req, res) {
  connection.acquire(function(err, con) {
    con.query('DELETE FROM Request WHERE requestId = ?', req.params.id,
      function(err, result) {
        con.release();
        if (err) {
          res.send(err);
        } else {
          res.send({
            status: 200,
            message: 'Delete from Request successfully'});
        }
      });
  });
});

module.exports = router;
