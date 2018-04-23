const express = require('express');
const router = express.Router();
const config = require('../config.js');
const connection = require('../connection');

// put rating to a user
// example put users/api/ratings/DDTT_45
router.put('/ratings/:id', function(req,res){
  console.log("put rating of a user");
  connection.acquire(function(err, con){
    // get number of people having rated this user
    con.query('SELECT ratingWeight,rating FROM User WHERE userId = ?', req.params.id,
      function(err, result) {
        if (err){
          res.send(err);
        }else{
          // put average rating to this user
          if (result.length === 0){
            res.send("userId not exist");
          }else{
            console.log(result[0].rating);
            const newWeight = result[0].ratingWeight + 1;
            const aveRating = (result[0].ratingWeight * result[0].rating + parseInt(req.body.rating))/newWeight;
            con.query('UPDATE User SET rating = ?, ratingWeight = ? WHERE userId = ?',
              [aveRating, newWeight, req.params.id],
              function(err, result) {
                con.release();
                if (err){
                  res.send(err);
                }else{
                  res.send(result);
                }
              });
          }
        }
      });
  });
});

// get all information of a user
// example get users/api/DDTT_45
router.get('/:id', function(req,res){
    console.log("get info of user");
    connection.acquire(function(err, con){
        con.query('SELECT * FROM User WHERE userId = ?', req.params.id,
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

// update a user information
// example put users/api/DDTT_45
router.put('/:id', function(req,res){
  console.log("put a user");

  connection.acquire(function(err, con){
    con.query('SELECT * FROM User WHERE userId = ?', req.params.id,
      function(err, result) {
        con.release();
        if (err){
          res.send(err);
        }else{
          res.send(result);
        }
      });
  });

  connection.acquire(function(err, con) {
    let update_query = ' UPDATE User SET ';
    let isFirst = true;

    if (req.body.username){
      if (!isFirst) {update_query += ' , '};
      update_query += ' username = "'+req.body.username+'" ';
      isFirst = false;
    };
    if (req.body.phone){
      if (!isFirst) {update_query += ' , '};
      update_query += ' phone = '+req.body.phone;
      isFirst = false;
    };
    if (req.body.email){
      if (!isFirst) {update_query += ' , '};
      update_query += ' email = "'+ req.body.email+'" ';
      isFirst = false;
    };

    update_query += ' WHERE userId = ? ';

    con.query(update_query, req.params.id,
      function(err, result) {
        con.release();
        if (err) {
          res.send(err);
        } else {
          res.send({
            status: 200,
            message: 'Update User successfully'
          });
        }
      });
  });
});



// invitation: recommend user to user
router.get('/recommendation/:requestId', function(req, res) {
  console.log("USER API: recommend user based on request id")
  connection.acquire(function(err, con){
    con.query(
      'SELECT * FROM User WHERE User.userId IN\
      (SELECT DISTINCT r.userId \
       FROM Request AS r,\
          (SELECT * FROM Request WHERE requestId = ?) as result\
       WHERE (r.type = result.type\
       OR r.url = result.url\
       OR r.address = result.address)\
       AND r.userId <> result.userId)',
      req.params.requestId,
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

// invite, send email to invite
router.post('/invite', function(req, res) {
  const requestId = req.body.requestId;
  const message = req.body.message;

  console.log("USER API: invite user")
  connection.acquire(function(err, con){
    con.query(
      'SELECT email FROM User WHERE User.userId IN\
      (SELECT DISTINCT r.userId \
       FROM Request AS r,\
          (SELECT * FROM Request WHERE requestId = ?) as result\
       WHERE (r.type = result.type\
       OR r.url = result.url\
       OR r.address = result.address)\
       AND r.userId <> result.userId)',
      requestId,
      function(err, result) {

        if (err){
          res.send(err);
        }else{
          console.log(result);
          let emailList = '';
          result.forEach(item=>{
            emailList += item.email+',';
          });

          connection.acquire(function(err, con){
            con.query(
              'SELECT username FROM User,Request WHERE requestId = ? AND User.userId=Request.userId',
              requestId,
              function(err, result) {
                if (err){
                  res.send(err);
                }else{
                  const username = result[0].username

                  // send email
                  const mailOptions = {
                    from: 'zhangyu9610@gmail.com',
                    to: emailList,
                    subject: 'BUYPOOL: '+username+' invites you to join a request.',
                    text: message
                  };
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                      res.status(200).send("Invite successfully");
                    }
                  });
                }
              });
          });
        }
        con.release();
      });
  });
})



// router.get('/', function(req, res, next) {
//   // GET/users/ route
//   res.send({name:config.admin.name});
// });

// // app/routes.js
// module.exports = function(app, passport) {
//     // app.get('/', function(req, res) {
//     //     res.status(200).send({
//     //         message: 'OK',
//     //         data: []
//     //     })
//     // });
//     //
//     // app.get('/login', function(req, res) {
//     //
//     // });
//
//     // process the login form
//     app.post('/login', passport.authenticate('local-login', {
//             successRedirect : '/', // redirect to the secure profile section
//             failureRedirect : '/login', // redirect back to the signup page if there is an error
//             failureFlash : true // allow flash messages
//         }),
//         function(req, res) {
//             console.log("hello");
//
//             if (req.body.remember) {
//                 req.session.cookie.maxAge = 1000 * 60 * 3;
//             } else {
//                 req.session.cookie.expires = false;
//             }
//             res.redirect('/');
//         });
//
//
//     // show the signup form
//     // app.get('/signup', function(req, res) {
//     //     // render the page and pass in any flash data if it exists
//     //     res.render('signup.ejs', { message: req.flash('signupMessage') });
//     // });
//
//     // process the signup form
//     app.post('/signup', passport.authenticate('local-signup', {
//         successRedirect : '/', // redirect to the secure profile section
//         failureRedirect : '/signup', // redirect back to the signup page if there is an error
//         failureFlash : true // allow flash messages
//     }));
//
//
//     // app.get('/profile', isLoggedIn, function(req, res) {
//     //     res.render('profile.ejs', {
//     //         user : req.user // get the user out of session and pass to template
//     //     });
//     // });
//
//
//     app.get('/logout', function(req, res) {
//         req.logout();
//         res.redirect('/');
//     });
// };
//
// // route middleware to make sure
// function isLoggedIn(req, res, next) {
//
//     // if user is authenticated in the session, carry on
//     if (req.isAuthenticated())
//         return next();
//
//     // if they aren't redirect them to the home page
//     res.redirect('/');
// }


module.exports = router;
