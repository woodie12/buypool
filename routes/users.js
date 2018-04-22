const express = require('express');
const router = express();
const passport = require('passport');


// router.get('/', function(req, res, next) {
//   // GET/users/ route
//   res.send({name:config.admin.name});
// });


// app/routes.js
// module.exports = function(router, passport) {
    // app.get('/', function(req, res) {
    //     res.status(200).send({
    //         message: 'OK',
    //         data: []
    //     })
    // });
    //
    // app.get('/login', function(req, res) {
    //
    // });

    // process the login form
    router.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }

            res.status(200).json({ user: req.user, message: "Welcome!"
            });
        });


    // show the signup form
    // app.get('/signup', function(req, res) {
    //     // render the page and pass in any flash data if it exists
    //     res.render('signup.ejs', { message: req.flash('signupMessage') });
    // });

    // process the signup form
    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }),function(req, res) {
        console.log("hello");

        res.status(200).json({ user: req
        });
    });


    // app.get('/profile', isLoggedIn, function(req, res) {
    //     res.render('profile.ejs', {
    //         user : req.user // get the user out of session and pass to template
    //     });
    // });


    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
// };

// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;
