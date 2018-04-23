const express = require('express');
const router = express.Router();
const connection = require('../connection');
const transporter = require('../email');
const passport = require('passport');

router.post('/login', passport.authenticate('local-login', {
        // successRedirect : '/', // redirect to the secure profile section
        // failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true, // allow flash messages
        session: false
    }),
    function( req, res) {
        console.log(req.user);
        if(!req.user){
            res.status(500).json({ message: 'wrong password ot no account'})
        }else {

            // if (req.body.remember) {
            //     req.session.cookie.maxAge = 1000 * 60 * 3;
            // } else {
            //     req.session.cookie.expires = false;
            // }

            res.status(200).json({
                user: req.user, message: "Welcome!"
            });
        }
    });



router.post('/signup', function(req, res, next) {
    passport.authenticate('local-signup', {
        // successRedirect : '/', // redirect to the secure profile section
        // failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    },function(err, user, info) {
        if (err) { return next(err); }
        if (!user) { res.status(500).json({ message: 'already exist'}) }
        console.log("USER API: signup user with further info");
        console.log(user);

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
            if (req.body.address){
                if (!isFirst) {update_query += ' , '};
                update_query += ' address = "'+ req.body.address+'" ';
                isFirst = false;
            };

            update_query += ' WHERE email = "'+ req.body.email+'" ';

            console.log("USER API: "+update_query);

            con.query(update_query,
                function(err,  result) {
                    con.release();
                    if (err) {
                        res.send(err);
                    } else {
                        res.send({
                            status: 200,
                            message: 'Update User successfully',
                            user: user
                        });
                    }
                });
        });

    })(req, res, next);
});




// put rating to a user
// example put users/api/ratings/DDTT_45
router.put('/ratings/:id', function(req,res){
    console.log("USER API: put rating of a user");
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
    console.log("USER API: get info of user");
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
    console.log("USER API: put a user");

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

        console.log("USER API: "+update_query);

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


module.exports = router;