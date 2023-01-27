var express = require('express');
var bodyparser = require('body-parser');
var cors = require('cors');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var appRoot = require('app-root-path');

var users = require('./api/users');
var jobs = require('./api/jobs');
var companies = require('./api/companies');
var candidates = require('./api/candidates');
var recruiters = require('./api/recruiters');
var auth = require('./auth/passport');
var resumes = require('./api/resumes');
var payments = require('./api/payments');
var invites = require('./api/invites');
var assessments = require('./api/assessments');
var admins = require('./api/admins');

var config = require('./config/config');
var User = require('./models/user');
var Job = require('./models/job');
var db = require('./db/database');
var helpers = require('./config/helpers');
var logger = require('./config/log4js');

const app = express();

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(session({
    secret: config.session_secret,
    resave: config.session_resave,
    key: config.session_key,
    saveUninitialized: config.session_save_uninitialized,
    cookie: { maxAge: config.session_cookie_max_age }
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/assets'));

app.use("/users", users);
app.use("/jobs", jobs);
app.use("/companies", companies);
app.use("/auth", auth);
app.use("/candidates", candidates);
app.use("/recruiters", recruiters);
app.use("/resume", resumes);
app.use("/payments", payments);
app.use("/invites", invites);
app.use("/assessments", assessments);
app.use("/admin", admins);

app.get('/faq', function(req, res) {
    try {
        if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
            var userData = req.session.passport.user;
            res.render('faq', {
                userAuthenticated: 'true',
                userData: userData
            });
        } else {
            res.render('faq', {
                userAuthenticated: 'false'
            });
        }
    } catch (error) {
        logger.log(error);
    }
});

app.get('/', function(req, res) {
    try {
        var job = new Job();
        db.query(job.get10LatestJobs(), (err, data) => {
            if (err) { logger.log(err) } else {
                var jobs = data;

                for (var i = 0; i < jobs.length; i++) {
                    jobs[i].company_logo_url = jobs[i].company_logo_url.replace('/uploads/images/company_logos/', config.azure_company_logo_url);
                }

                db.query(job.get10LatestMedicalJobs(), (err, data) => {
                    if (err) { logger.log(err) } else {
                        var medicalJobs = data;

                        for (var i = 0; i < medicalJobs.length; i++) {
                            medicalJobs[i].company_logo_url = medicalJobs[i].company_logo_url.replace('/uploads/images/company_logos/', config.azure_company_logo_url);
                        }

                        if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
                            var userData = req.session.passport.user;
                            res.render('index', {
                                userAuthenticated: 'true',
                                userData: userData,
                                jobs: jobs,
                                medicalJobs: medicalJobs
                            });
                        } else {
                            res.render('index', {
                                userAuthenticated: 'false',
                                jobs: jobs,
                                medicalJobs: medicalJobs
                            });
                        }
                    }
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

app.get('/company-info', function(req, res) {
    try {
        if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
            var userData = req.session.passport.user;
            res.render('company_info', {
                userAuthenticated: 'true',
                userData: userData
            });
        } else {
            res.render('company_info', {
                userAuthenticated: 'false'
            });
        }
    } catch (error) {
        logger.log(error);
    }
});

app.get('/find-a-job', function(req, res) {
    try {
        if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
            var userData = req.session.passport.user;
            res.render('search_job', {
                userAuthenticated: 'true',
                userData: userData
            });
        } else {
            res.render('search_job', {
                userAuthenticated: 'false'
            });
        }
    } catch (error) {
        logger.log(error);
    }
});

app.get('/sterling-oil-jobs', function(req, res) {
    try {
        if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
            var userData = req.session.passport.user;
            res.render('temp_sterling_oil_jobs', {
                userAuthenticated: 'true',
                userData: userData
            });
        } else {
            res.render('temp_sterling_oil_jobs', {
                userAuthenticated: 'false'
            });
        }
    } catch (error) {
        logger.log(error);
    }
});

app.get('/skilled-jobs', function(req, res) {
    try {
        if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
            var userData = req.session.passport.user;
            res.render('temp_latest_jobs', {
                userAuthenticated: 'true',
                userData: userData
            });
        } else {
            res.render('temp_latest_jobs', {
                userAuthenticated: 'false'
            });
        }
    } catch (error) {
        logger.log(error);
    }
});

app.get('/job-detail/:jobId', function(req, res) {
    try {
        var jobId = req.params.jobId;

        db.query(Job.getJobByIdQuery(jobId), (err, data) => {
            if (!err) {
                var jobData = data[0];

                if (jobData) {
                    //console.log('here')

                    if (typeof jobData.company_description != 'undefined' && jobData.company_description != null &&
                        jobData.company_description != 'null' && jobData.company_description != '') {

                        jobData.company_description = jobData.company_description.substring(0, jobData.company_description.length - 1);
                        jobData.company_description = helpers.unescapeHTML(jobData.company_description);
                    }

                    if (typeof jobData.job_description != 'undefined' && jobData.job_description != null &&
                        jobData.job_description != 'null' && jobData.job_description != '') {

                        jobData.job_description = jobData.job_description.substring(0, jobData.job_description.length - 1);
                        jobData.job_description = helpers.unescapeHTML(jobData.job_description);
                    }

                    /* if (typeof jobData.job_responsibilities != 'undefined' && jobData.job_responsibilities != null &&
                         jobData.job_responsibilities != 'null' && jobData.job_responsibilities != '') {

                         jobData.job_responsibilities = jobData.job_responsibilities.substring(0, jobData.job_responsibilities.length - 1);
                         jobData.job_responsibilities = helpers.unescapeHTML(jobData.job_responsibilities);
                     } */

                    jobData.application_deadline = helpers.checkApplicationDeadline(jobData.application_deadline);
                    //console.log(jobData)

                    if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
                        var userData = req.session.passport.user;
                        res.render('job_detail', {
                            userAuthenticated: 'true',
                            jobData: jobData,
                            userData: userData
                        });
                    } else {
                        res.render('job_detail', {
                            userAuthenticated: 'false',
                            jobData: jobData
                        });
                    }

                } else {
                    if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
                        var userData = req.session.passport.user;
                        res.status(404).render('404', {
                            userAuthenticated: 'true',
                            userData: userData
                        });
                    } else {
                        res.status(404).render('404', {
                            userAuthenticated: 'false'
                        });
                    }
                }
            } else {
                logger.log('Error getting job');
                logger.log(err);
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

app.get('/login', function(req, res) {
    try {
        var redirectFrom = req.query.f;
        var response = req.query.r;

        if (typeof redirectFrom != 'undefined' && redirectFrom) {
            //If redirect is from Update User Profile
            if (redirectFrom == 'u_iu') {
                res.render('login', {
                    showAlert: true,
                    alertMessage: response == 's' ? 'Information Saved Successfully. Please login' : 'Profile could not update',
                    alertType: response == 's' ? 'success' : 'error'
                });
            } else if (redirectFrom == 'l') {
                res.render('login', {
                    showAlert: true,
                    alertMessage: response == 's' ? 'Login Successful' : 'Invalid E-mail or Password',
                    alertType: response == 's' ? 'success' : 'error'
                });
            } else if (redirectFrom == 'fp') {
                res.render('login', {
                    showAlert: true,
                    alertMessage: response == 's' ? 'Password has been changed successfully' : 'Something happened while changing your password. Please contact support.',
                    alertType: response == 's' ? 'success' : 'error'
                });
            } else if (redirectFrom == 'start_test') {
                res.render('login', {
                    showAlert: true,
                    alertMessage: 'You need to login to take this test',
                    alertType: 'info',
                    returnUrl: 'start_test'
                });
            } else if (redirectFrom == 'cv_fix') {
                res.render('login', {
                    showAlert: true,
                    alertMessage: 'You need to login to pay for CV Fix',
                    alertType: 'info',
                    returnUrl: 'cv_fix'
                });
            }

        } else {
            res.render('login');
        }
    } catch (error) {
        logger.log(error);
    }

});

app.get('/candidate-info', function(req, res) {
    try {
        if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
            var userData = req.session.passport.user;
            res.render('candidates_landing_page', {
                userAuthenticated: 'true',
                userData: userData
            });
        } else {
            res.render('candidates_landing_page', {
                userAuthenticated: 'false'
            });
        }
    } catch (error) {
        logger.log(error);
    }
});

app.get('/recruiter-info', function(req, res) {
    try {
        if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
            var userData = req.session.passport.user;
            res.render('recruiters_landing_page', {
                userAuthenticated: 'true',
                userData: userData
            });
        } else {
            res.render('recruiters_landing_page', {
                userAuthenticated: 'false'
            });
        }
    } catch (error) {
        logger.log(error);
    }

});

app.get('/assessment', function(req, res) {
    try {
        if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
            var userData = req.session.passport.user;
            res.render('assessment_landing_page', {
                userAuthenticated: 'true',
                userData: userData
            });
        } else {
            res.render('assessment_landing_page', {
                userAuthenticated: 'false'
            });
        }
    } catch (error) {
        logger.log(error);
    }
});

app.get('/career-advice', function(req, res) {
    try {
        res.redirect('http://blog.getajobng.com');
    } catch (error) {
        logger.log(error);
    }
});

app.get('/cv-fix', function(req, res) {
    try {
        if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
            var userData = req.session.passport.user;
            res.render('cv_fix', {
                userAuthenticated: 'true',
                userData: userData
            });
        } else {
            res.render('cv_fix', {
                userAuthenticated: 'false'
            });
        }
    } catch (error) {
        logger.log(error);
    }
});

app.get('/process-cv-fix', function(req, res) {
    try {
        if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
            res.redirect('/candidates/cv-fix');
        } else {
            res.redirect('/login?f=cv_fix');
        }
    } catch (error) {
        logger.log(error);
    }
});

app.get('/post-a-job', function(req, res) {
    try {
        res.render('login');
    } catch (error) {
        logger.log(error);
    }
});

app.get('/register', function(req, res) {
    try {
        var response = req.query.v;

        if (typeof response != 'undefined' && response) {
            if (response == 'c_f') {
                res.render('register', {
                    showAlert: true,
                    alertMessage: response == 'c_f' ? 'Captcha verification failed. Please try again.' : 'Registration Successful',
                    alertType: response == 'c_f' ? 'error' : 'success'
                });
            } else {
                res.render('register', {
                    showAlert: true,
                    alertMessage: response == 's' ? 'Registration Successful' : 'This email address exists in our database. Please use another email.',
                    alertType: response == 's' ? 'success' : 'error'
                });
            }

        } else {
            res.render('register');
        }
    } catch (error) {
        logger.log(error);
    }
});

app.get('/forgot-password', function(req, res) {
    try {
        var response = req.query.v;

        if (typeof response != 'undefined' && response) {
            if (response == 'c_f') {
                res.render('forgot_password', {
                    showAlert: true,
                    alertMessage: response == 'c_f' ? 'Captcha verification failed. Please try again.' : 'Registration Successful',
                    alertType: response == 'c_f' ? 'error' : 'success'
                });
            } else {
                res.render('forgot_password', {
                    showAlert: true,
                    alertMessage: response == 's' ? 'A Password Reset link has been sent to your registered email address' : 'This email address does not exist in our database.',
                    alertType: response == 's' ? 'success' : 'error'
                });
            }
        } else {
            res.render('forgot_password');
        }
    } catch (error) {
        logger.log(error);
    }
});

app.get("/create-password", (req, res, next) => {
    try {
        var user_id = req.query.userId;

        res.render('change_password', { user_id: user_id });
    } catch (error) {
        logger.log(error);
    }
});

app.post("/create-password-for-user", (req, res, next) => {
    try {
        var user_id = req.body.user_id;
        var password = req.body.password;

        db.query(User.updatePasswordForUser(user_id, password), (err, data) => {
            if (!err) {
                if (data && data.affectedRows > 0) {

                    helpers.saveActivityTrail(user_id, "Password Reset", "Password has been changed successfully.");

                    res.redirect('/login?f=fp&r=s');

                } else {
                    res.redirect('/recruiters/create-password?userId=' + user_id);
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

app.get('/privacy-policy', function(req, res) {
    try {
        if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
            var userData = req.session.passport.user;
            res.render('privacy_policy', {
                userAuthenticated: 'true',
                userData: userData
            });
        } else {
            res.render('privacy_policy', {
                userAuthenticated: 'false'
            });
        }
    } catch (error) {
        logger.log(error);
    }
});

app.get('/cookie-policy', function(req, res) {
    try {
        if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
            var userData = req.session.passport.user;
            res.render('cookie_policy', {
                userAuthenticated: 'true',
                userData: userData
            });
        } else {
            res.render('cookie_policy', {
                userAuthenticated: 'false'
            });
        }
    } catch (error) {
        logger.log(error);
    }
});

app.get('/about-us', function(req, res) {
    try {
        if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
            var userData = req.session.passport.user;
            res.render('about_us', {
                userAuthenticated: 'true',
                userData: userData
            });
        } else {
            res.render('about_us', {
                userAuthenticated: 'false'
            });
        }
    } catch (error) {
        logger.log(error);
    }
});

app.get('/contact-us', function(req, res) {
    try {
        if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
            var userData = req.session.passport.user;
            res.render('contact_us', {
                userAuthenticated: 'true',
                userData: userData
            });
        } else {
            res.render('contact_us', {
                userAuthenticated: 'false'
            });
        }
    } catch (error) {
        logger.log(error);
    }
});

app.get('/disclaimer', function(req, res) {
    try {
        if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
            var userData = req.session.passport.user;
            res.render('disclaimer', {
                userAuthenticated: 'true',
                userData: userData
            });
        } else {
            res.render('disclaimer', {
                userAuthenticated: 'false'
            });
        }
    } catch (error) {
        logger.log(error);
    }
});

app.get('/h1dd3n_s1t3map', function(req, res) {
    try {
        var sitemap_file = `${appRoot}/views/includes/sitemap/sitemap.xml`;

        res.sendFile(sitemap_file);
    } catch (error) {
        logger.log(error);
    }
});


//if we are here then the specified request is not found
app.use((req, res, next) => {
    try {
        if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
            var userData = req.session.passport.user;
            res.status(404).render('404', {
                userAuthenticated: 'true',
                userData: userData
            });
        } else {
            res.status(404).render('404', {
                userAuthenticated: 'false'
            });
        }
    } catch (error) {
        logger.log(error);
    }
});

//all other requests are not implemented.
app.use((err, req, res, next) => {
    res.status(err.status || 501);
    res.json({
        error: {
            code: err.status || 501,
            message: err.message
        }
    });
});

module.exports = app;