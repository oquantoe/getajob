var db = require('../db/database');
var User = require('../models/user');
var Company = require('../models/company');
var Resume = require('../models/resume');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var GoogleStrategy = require('passport-google-oauth20');
var LocalStrategy = require('passport-local').Strategy;
var config = require('../config/config');
var dateTime = require('node-datetime');
var bcrypt = require('bcryptjs');
var flash = require('connect-flash');
var storage = require('./../config/session_store');
var logger = require('./../config/log4js');
var uuidv1 = require('uuid/v1');
var mailer = require('../config/mail/mailer');
var helper = require('./../config/helpers');
var request = require('request');

const auth = express.Router();

auth.use(cookieParser());
auth.use(bodyParser.urlencoded({ extended: false }));
auth.use(passport.initialize());
auth.use(passport.session());
auth.use(flash());

auth.use(session({
    secret: config.session_secret,
    resave: config.session_resave,
    key: config.session_key,
    saveUninitialized: config.session_save_uninitialized,
    // cookie: { maxAge: config.session_cookie_max_age }
    cookie: { secure: false }
}));


// Passport Local Strategy 
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},
    function (req, username, password, done) {
        try {
            var returnUrl = req.body.returnUrl;
            var token = req.body.token;

            console.log('returnUrl(before) - ' + returnUrl)
            console.log('token(before) - ' + token)

            db.query(User.checkIfEmailExist(username), (err, data) => {
                if (err) {
                    logger.log(err)
                    return done(null, false, { message: 'Error' });
                }
                if (!data) {
                    logger.log("NO DATA")
                    return done(null, false, { message: 'bad password' });
                }

                // if the user is found but the password is wrong
                if (data.length > 0) {
                    if (!bcrypt.compareSync(password, data[0].password)) {
                        logger.log("Password does not match")
                        return done(null, false, { message: 'bad password2' });
                    }
                }

                if (!data || data.length == 0) {
                    logger.log("This email is not registered")
                    return done(null, false, { message: 'bad email/password' });
                } else {
                    var getUserDataQuery = '';

                    if (data[0].role_id == config.candidate_role_tag) {
                        getUserDataQuery = User.getCandidateData(data[0].user_id);
                    } else if (data[0].role_id == config.admin_role_tag) {
                        getUserDataQuery = User.getAdminData(data[0].user_id);
                    } else {
                        getUserDataQuery = User.getRecruiterData(data[0].user_id);
                    }

                    db.query(getUserDataQuery, (err, data) => {
                        if (err) { logger.log(err) } else {
                            //Check if there is a return url. If yes add it to userdata
                            if (typeof returnUrl != 'undefined' && returnUrl) {
                                data[0].returnUrl = returnUrl;
                                data[0].token = token;
                            }

                            // all is well, return successful user
                            return done(null, data[0]);
                        }
                    });
                }
            });
        } catch (error) {
            logger.log(error);
        }

    }
));

auth.post('/login', passport.authenticate('local', {
    failureRedirect: '/login?f=l&r=f', // redirect back to the signup page if there is an error
    failureFlash: true,
    failureMessage: "Invalid Email/Password. Please try again."

}), function (req, res) {
    try {
        //logger.log("User exist and is redirecting");

        //logger.log(req.user);
        var userData = req.user;

        db.query(User.getUserRoleByUserId(userData.user_id), (err, data) => {
            if (!err) {
                if (data) {
                    var user_role = data[0].role_id;
                    //logger.log("user_role -" + user_role);

                    if (user_role == config.candidate_role_tag) {
                        if (userData.returnUrl == 'start_test') {
                            processCandidateLoginToAssessment(req, res, userData, userData.token)
                        } else if (userData.returnUrl == 'cv_fix') {
                            processCandidateLoginToCVFix(req, res, userData, user_role);
                        } else {
                            processCandidateLogin(req, res, userData, user_role);
                        }
                    } else if (user_role == config.recruiter_admin_role_tag) {
                        processRecruiterAdminLogin(req, res, userData, user_role);
                    } else if (user_role == config.recruiter_role_tag) {
                        processRecruiterLogin(req, res, userData, user_role);
                    } else if (user_role == config.admin_role_tag) {
                        processAdminLogin(req, res, userData, user_role);
                    } else {
                        logger.log('No user role')
                        res.redirect('/login');
                    }
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

auth.get('/login', passport.authenticate('local', {
    failureRedirect: '/login?f=l&r=f', // redirect back to the signup page if there is an error
    failureFlash: true,
    failureMessage: "Invalid Email/Password. Please try again."

}), function (req, res) {
    try {
        //logger.log("User exist and is redirecting");

        logger.log(req.user);
        var userData = req.user;

        //Save user id
        //storage.saveUserId(req, userData.user_id);

        db.query(User.getUserRoleByUserId(userData.user_id), (err, data) => {
            if (!err) {
                if (data) {
                    var user_role = data[0].role_id;
                    logger.log("user_role -" + user_role);

                    if (user_role == config.candidate_role_tag) {
                        processCandidateLogin(req, res, userData, user_role);
                    } else if (user_role == config.recruiter_admin_role_tag) {
                        processRecruiterAdminLogin(req, res, userData, user_role);
                    } else if (user_role == config.recruiter_role_tag) {
                        processRecruiterLogin(req, res, userData, user_role);
                    } else {
                        logger.log('No user role')
                        res.redirect('/login');
                    }
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

function processCandidateLogin(req, res, user, user_role) {
    try {
        logger.log("User is a CANDIDATE. Getting all users info ");

        db.query(Resume.getResumeIdByUserId(user.user_id), (err, data) => {
            if (!err) {
                if (data) {
                    var resume_id = data[0].resume_id;



                    //Save user info
                    // storage.saveCandidateData(req, user.user_id, user.user_uuid, user.first_name,
                    //    user.last_name, user.email, user.phone_number, user_role, true, user.is_activated,
                    //    resume_id, user.is_first_login, user.gender, user.tagline, user.address, user.photo_url)
                }
            }
        });

        // Get all candidate resume
        var resume = new Resume();
        resume.getAllUserResumeInformation(req, user.user_id);

        //Redirect to dashboard
        res.redirect('/candidates/dashboard');
    } catch (error) {
        logger.log(error);
    }
}

function processRecruiterAdminLogin(req, res, user, user_role) {
    try {
        logger.log("User is a RECRUITER ADMIN. Getting all info ");

        db.query(Company.getUserCompany(user.user_id), (err, data) => {
            if (err) { logger.log(err) } else {
                if (data) {
                    var company_id = data[0].company_id;
                    var company_name = data[0].company_name;

                    //Save recruiter info
                    //storage.saveRecruiterData(req, user.user_id, user.user_uuid, user.first_name,
                    //    user.last_name, user.email, user.phone_number, user_role, true, company_id, 
                    //    company_name, user.is_activated, user.is_first_login, user.photo_url);

                    // Redirect to dashboard
                    res.redirect('/recruiters/dashboard');
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }
}

function processRecruiterLogin(req, res, user, user_role) {
    try {
        logger.log("User is a RECRUITER. Getting all info ");

        db.query(Company.getCompanyByIdQuery(user.company), (err, data) => {
            if (err) { logger.log(err) } else {
                if (data) {
                    var company_id = data[0].company_id;
                    var company_name = data[0].company_name;

                    //Save recruiter info
                    //storage.saveRecruiterData(req, user.user_id, user.user_uuid, user.first_name,
                    //    user.last_name, user.email, user.phone_number, user_role, true, company_id, 
                    //    company_name, user.is_activated, user.is_first_login, user.photo_url)

                    // Redirect to dashboard
                    res.redirect('/recruiters/dashboard');
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }
}

function processAdminLogin(req, res, user, user_role) {
    try {
        logger.log("User is an ADMIN. Getting all info ");

        res.redirect('/admin/dashboard');
    } catch (error) {
        logger.log(error);
    }
}

function processCandidateLoginToAssessment(req, res, user, token) {
    try {
        logger.log("User is a CANDIDATE. Redirecting to Assessment");

        //Redirect to assessment
        res.redirect('/assessments/take-assessment/' + token);
    } catch (error) {
        logger.log(error);
    }
}

function processCandidateLoginToCVFix(req, res, user, token) {
    try {
        logger.log("User is a CANDIDATE. Redirecting to CV Fix");

        //Redirect to assessment
        res.redirect('/candidates/cv-fix');
    } catch (error) {
        logger.log(error);
    }
}

// Passport Facebook Strategy 
passport.use(new FacebookStrategy({
    clientID: config.facebook_api_key,
    clientSecret: config.facebook_api_secret,
    callbackURL: config.facebook_callback_url,
    profileFields: [
        "id",
        "displayName",
        "email",
        "gender",
        "picture.type(large)"
    ]
},

    function (accessToken, refreshToken, profile, done) {
        try {
            process.nextTick(function () {
                if (config.use_database === true) {

                    db.query(User.checkIfUserExistsBySocialMediaId(profile.id), (err, data) => {
                        if (err) {
                            throw err;
                        }
                        if (data && data.length === 0) {
                            var fullname = profile.displayName.split(' ');
                            var first_name, last_name = '';

                            if (fullname.length > 0) {
                                first_name = fullname[1];
                                last_name = fullname[0];
                            } else {
                                first_name = fullname;
                            }

                            var dt = dateTime.create();
                            var date_created = dt.format('Y-m-d H:M:S');

                            var user = new User(uuidv1(), first_name, last_name, profile.emails[0].value, 'password',
                                profile.id, date_created);
                            db.query(user.createCandidateQuery(), function (err, data) {
                                if (err) { throw err; } else {
                                    if (data) {
                                        var user_id = data.insertId;

                                        db.query(User.insertUserRole(user_id, 1), (err, data) => {
                                            if (!err) {
                                                logger.log("Candidate added with user role.");
                                                return done(null, profile);
                                            }
                                        })
                                    }
                                }

                            });
                            return done(null, profile);
                        } else {
                            logger.log("User already exist");
                            return done(null, profile);
                        }
                    });

                }
            });
        } catch (error) {
            logger.log(error);
        }

    }));

auth.get('/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));

auth.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), function (req, res) {
    try {
        logger.log('in facebook callback');
        res.render('dashboard');
    } catch (error) {
        logger.log(error);
    }
});



// Passport Google Strategy 
passport.use(new GoogleStrategy({
    clientID: config.google_client_id,
    clientSecret: config.google_client_secret,
    callbackURL: config.google_callback_url,
},

    function (accessToken, refreshToken, profile, done) {
        try {
            process.nextTick(function () {
                if (config.use_database === true) {

                    db.query(User.checkIfUserExistsBySocialMediaId(profile.id), (err, data) => {
                        if (err) {
                            throw err;
                        }
                        if (data && data.length === 0) {
                            var fullname = profile.displayName.split(' ');
                            var first_name, last_name = '';

                            if (fullname.length > 0) {
                                first_name = fullname[1];
                                last_name = fullname[0];
                            } else {
                                first_name = fullname;
                            }

                            var dt = dateTime.create();
                            var date_created = dt.format('Y-m-d H:M:S');

                            var user = new User(uuidv1(), first_name, last_name, profile.emails[0].value, 'password',
                                profile.id, date_created);
                            db.query(user.createCandidateQuery(), function (err, data) {
                                if (err) { throw err; } else {
                                    if (data) {
                                        var user_id = data.insertId;

                                        db.query(User.insertUserRole(user_id, config.candidate_role_tag), (err, data) => {
                                            if (!err) {
                                                logger.log("Candidate added with user role.");
                                                return done(null, profile);
                                            }
                                        })
                                    }
                                }

                            });
                            return done(null, profile);
                        } else {
                            logger.log("User already exist");
                            return done(null, profile);
                        }
                    });

                }
            });
        } catch (error) {
            logger.log(error);
        }


    }));

auth.get('/google', passport.authenticate('google', { scope: ['email', 'profile', 'openid'] }));

auth.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), function (req, res) {
    try {
        logger.log('in google callback');
        res.render('dashboard');
    } catch (error) {
        logger.log(error);
    }
});


// Passport LinkedIn Strategy 
// passport.use(new LinkedInStrategy({
//     clientID: config.linkedin_client_id,
//     clientSecret: config.linkedin_client_secret,
//     callbackURL: config.linkedin_callback_url,
//     scope: ['r_emailaddress', 'r_liteprofile', 'w_member_social']
// }, 

// function(accessToken, refreshToken, profile, done) {
//     // asynchronous verification, for effect...
//     process.nextTick(function () {

//         logger.log(profile)
//       return done(null, profile);
//     });
// })); 

// auth.get('/linkedin', passport.authenticate('linkedin', {state: true}));

// auth.get('/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/' }),
// function(req, res) {
//   logger.log('in linkedin callback');
//   res.render('dashboard');
// });


auth.get('/logout', function (req, res) {
    try {
        req.logout();
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        logger.log(error);
    }
});

const ensureAuthenticated = (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            logger.log("user is already authenticated..proceed");
            return next();
        }

        logger.log("user is not authenticated..back to login");
        res.redirect('/login');
    } catch (error) {
        logger.log(error);
    }
}

auth.post('/forgotpassword', function (req, res) {
    try {
        var captcha_response = req.body['g-recaptcha-response'];

        if (captcha_response === undefined || captcha_response === '' || captcha_response === null) {
            res.redirect('/forgot-password?v=c_f')
        } else {
            var verificationUrl = config.captcha_verification_url_prefix + config.captcha_secret_key + "&response=" + captcha_response + "&remoteip=" + req.connection.remoteAddress;

            request(verificationUrl, function (error, response, body) {
                body = JSON.parse(body);

                if (body.success !== undefined && !body.success) {
                    res.redirect('/forgot-password?v=c_f')
                } else {
                    forgotPasswordProcess(req, res);
                }
            });
        }

    } catch (error) {
        logger.log(error);
    }
});

function forgotPasswordProcess(req, res) {
    try {
        var email = req.body.email;

        db.query(User.checkIfEmailExist(email), (err, data) => {
            if (err) { throw err; } else {
                if (data && data.length > 0) {
                    logger.log('user exist...Sending Password Reset Mail');

                    var userData = data[0];

                    var user_id = userData.user_id;
                    var userFullName = userData.first_name + " " + userData.last_name;

                    mailer.sendForgotPasswordEmail(req, user_id, userFullName, email);

                    res.redirect('/forgot-password?v=s');

                } else {
                    res.redirect('/forgot-password?v=f');
                }

            }
        });
    } catch (error) {
        logger.log(error);
    }
}

auth.get("/verify-password-token/:token", (req, res, next) => {
    try {
        var password_reset_token = req.params.token;

        db.query(User.getUserByPasswordResetToken(password_reset_token), (err, data) => {
            if (!err) {
                if (data && data.length > 0) {
                    logger.log("User id From Password Reset Token - " + data[0].user_id);
                    var user_id = data[0].user_id;

                    var user = new User();
                    db.query(user.deactivatePasswordResetToken(data[0].user_id), (err, data) => {
                        if (err) { logger.log(err) } else {
                            logger.log("User Password Reset Token is deactivated");

                            // Redirect to create password page
                            res.redirect('/create-password?userId=' + user_id);
                        }
                    });
                } else {
                    res.status(200).json({
                        message: "User Not found."
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

auth.get('/verify/:userId/:token', function (req, res) {
    try {
        var user_id = req.params.userId;
        var token = req.params.token;

        var user = new User();

        db.query(user.compareUserActivationToken(user_id, token), (err, data) => {
            if (!err) {
                if (data && data.length > 0) {
                    db.query(user.activateUser(user_id), (err, data) => {
                        if (!err) {
                            if (data && data.affectedRows > 0) {
                                logger.log("User activated");

                                var ifAuthenticated = helper.checkifAuthenticated(req, res);
                                logger.log('ifAuthenticated - ' + ifAuthenticated)

                                if (ifAuthenticated) {
                                    res.redirect("/candidates/dashboard");
                                }
                            } else {
                                logger.log("User NOT activated")
                                res.send("User NOT activated");
                            }
                        }
                    })
                } else {
                    logger.log("User with token doesnt exist")
                    res.send("User with token doesnt exist");
                }

            }
        });
    } catch (error) {
        logger.log(error);
    }

});

// Passport session setup.
passport.serializeUser((user, done) => {
    try {
        logger.log("This is user id serializwd -----" + user.user_id);
        logger.log(user);
        if (user) {
            done(null, user);
        } else {
            done(new Error("THAT_USER_DOESNT_EXIST"));
        }
    } catch (error) {
        logger.log(error);
    }
});

passport.deserializeUser((user, done) => {
    try {
        logger.log(user);
        if (user) {
            done(null, user);
        } else {
            done(new Error("THAT_USER_DOESNT_EXIST"));
        }
    } catch (error) {
        logger.log(error);
    }
});

module.exports = auth, ensureAuthenticated;