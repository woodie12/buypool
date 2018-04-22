var LocalStrategy   = require('passport-local').Strategy;

var mysql = require('mysql');
const bcrypt = require('bcrypt');

const dbconfig = require('../config');


// config/passport.js
var connection = mysql.createConnection({
    host: '192.17.90.133',
    user: 'webuypool_admin',
    password : 'adminadmin',
    database : 'webuypool_general'
});
// connection.connect()

connection.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log('0-0-0-',user.id,'o0o0o0',user);
        done(null, user.id);
    });

    // // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        console.log("----",id);
        connection.query('SELECT * FROM User WHERE userId = ?',[id], function(err, rows){
            console.log('u----',err)
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 8; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    passport.use(
        'local-signup',
        new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField : 'email',
                passwordField : 'password',
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function(req, email, password, done) {
            console.log("enter sign up -=-=-=-=-=-=")
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                connection.query("SELECT * FROM User WHERE email = ?",[email], function(err, rows) {
                    if (err)
                        return done(err);
                    if (rows.length) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        // if there is no user with that username
                        // create the user

                        var newUserMysql = {
                            email: email,
                            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)  // use the generateHash function in our user model
                        };
                        console.log(newUserMysql)

                        var insertQuery = 'INSERT INTO User ( email, password ) values (?,?)';

                        connection.query(insertQuery,[newUserMysql.email, newUserMysql.password],function(err, rows) {
                            if (err){
                                console.log(err.message);
                                return done(err);
                            }else {
                              console.log(rows)
                              console.log("insert account", rows.insertId)

                              newUserMysql.id = rows.insertId;

                              return done(null, newUserMysql);
                            }
                        });
                    }
                });
            })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField : 'email',
                passwordField : 'password',
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function(req, email, password, done) { // callback with email and password from our form
              console.log("enter log in -=-=-=-=-=-=")

              connection.query("SELECT * FROM User WHERE email = ?",[email], function(err, rows){
                    if (err) {
                        console.log("err", err);
                        return done(err);
                    }
                    if (!rows.length) {
                        console.log("no user found")
                        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                    }

                    // // if the user is found but the password is wrong
                    console.log('row is ',rows[0])
                    if (!bcrypt.compareSync(password, rows[0].password))
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                    // all is well, return successful user
                    console.log('done')
                    return done(null, rows[0]);
                });
            })
    );
};
