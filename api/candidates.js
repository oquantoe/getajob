var express = require('express');
var db = require('../db/database');
var User = require('../models/user');
var uuidv1 = require('uuid/v1');
var config = require('../config/config');
var mailer = require('../config/mail/mailer');
var helpers = require('../config/helpers');
var logger = require('../config/log4js');
var bcrypt = require('bcryptjs');
var formidable = require('formidable');
var path = require('path');
var https = require('https');
var http = require('http');
var appRoot = require('app-root-path');
var fs = require('fs');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var Resume = require('../models/resume');
var Job = require('../models/job');
var request = require('request');

var AzureHelper = require('../config/azure_helpers');

const router = express.Router();

router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: false }));

router.use(session({
    secret: config.session_secret,
    resave: config.session_resave,
    key: config.session_key,
    saveUninitialized: config.session_save_uninitialized,
    cookie: { maxAge: config.session_cookie_max_age }
}));

router.get('/dashboard', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        res.render('candidate_dashboard', {
            view: 'dashboard',
            data: userData
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get('/cv-fix', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        res.render('candidate_cv_fix', {
            view: 'cv-fix',
            data: userData
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get('/cv-payment-notification', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        res.render('candidate_cv_payment_notification', {
            view: 'cv-fix',
            data: userData
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get('/profile', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);
        logger.log(userData);

        var redirectFrom = req.query.q;
        var response = req.query.r;

        if (typeof redirectFrom != 'undefined' && redirectFrom) {
            if (redirectFrom == 'summary') {
                res.render('candidate_profile', {
                    view: 'profile',
                    data: userData,
                    showAlert: true,
                    alertMessage: response == 's' ? 'Summary Successfully Updated' : 'An error occurred',
                    alertType: response == 's' ? 'success' : 'error'
                });
            } else if (redirectFrom == 'we_a') {
                res.render('candidate_profile', {
                    view: 'profile',
                    data: userData,
                    showAlert: true,
                    alertMessage: response == 's' ? 'Experience Saved' : 'Experience not added',
                    alertType: response == 's' ? 'success' : 'error'
                });
            } else if (redirectFrom == 'we_e') {
                res.render('candidate_profile', {
                    view: 'profile',
                    data: userData,
                    showAlert: true,
                    alertMessage: response == 's' ? 'Experience Saved Successfully' : 'Experience edit failed',
                    alertType: response == 's' ? 'success' : 'error'
                });
            } else if (redirectFrom == 'we_d') {
                res.render('candidate_profile', {
                    view: 'profile',
                    data: userData,
                    showAlert: true,
                    alertMessage: response == 's' ? 'Experience Deleted Successfully' : 'An error occurred',
                    alertType: response == 's' ? 'success' : 'error'
                });
            } else if (redirectFrom == 'e_a') {
                res.render('candidate_profile', {
                    view: 'profile',
                    data: userData,
                    showAlert: true,
                    alertMessage: response == 's' ? 'Education Added' : 'Education not added',
                    alertType: response == 's' ? 'success' : 'error'
                });
            } else if (redirectFrom == 'e_d') {
                res.render('candidate_profile', {
                    view: 'profile',
                    data: userData,
                    showAlert: true,
                    alertMessage: response == 's' ? 'Education Deleted' : 'An error occurred',
                    alertType: response == 's' ? 'success' : 'error'
                });
            } else if (redirectFrom == 'e_e') {
                res.render('candidate_profile', {
                    view: 'profile',
                    data: userData,
                    showAlert: true,
                    alertMessage: response == 's' ? 'Education Saved Successfully' : 'Education edit failed',
                    alertType: response == 's' ? 'success' : 'error'
                });
            } else if (redirectFrom == 'resume') {
                res.render('candidate_profile', {
                    view: 'profile',
                    data: userData,
                    showAlert: true,
                    alertMessage: response == 's' ? 'Resume Uploaded Successfully' : 'Resume upload failed',
                    alertType: response == 's' ? 'success' : 'error'
                });
            }

        } else {
            res.render('candidate_profile', {
                view: 'profile',
                data: userData
            });
        }
    } catch (error) {
        logger.log(error);
    }
});

router.get('/get-all-resume-info', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;

        //var user = new User();
        db.query(Resume.getCountryAndState(userData.user_id), (err, data) => {
            if (err) { logger.log(err) } else {
                var state_name = '';
                var country_name = '';

                if (data[0]) {
                    state_name = typeof data[0].state_name != undefined && data[0].state_name != null &&
                        data[0].state_name != 'null' && data[0].state_name != '' ? data[0].state_name : '';

                    country_name = typeof data[0].country_name != undefined && data[0].country_name != null &&
                        data[0].country_name != 'null' && data[0].country_name != '' ? data[0].country_name : '';
                }

                //logger.log('state_name - ' + state_name);
                //logger.log('country_name - ' + country_name);

                db.query(Resume.getResumeByUserIdQuery(userData.user_id), (err, data) => {
                    if (err) { logger.log(err) } else {
                        var resume = data[0];
                        var resume_id = data[0].resume_id;

                        logger.log("resume - ")
                        logger.log(resume);

                        //Get all Candidate Educations
                        db.query(Resume.getAllEducationByResumeIdQuery(resume_id), (err, data) => {
                            if (err) { logger.log(err) } else {
                                var education = data;
                                logger.log("education - ")
                                logger.log(education);

                                //Get all Candidate WEs
                                db.query(Resume.getAllWorkExperienceByResumeIdQuery(resume_id), (err, data) => {
                                    if (err) { logger.log(err) } else {
                                        var work_experience = data;
                                        logger.log("work_experience - ")
                                        logger.log(work_experience);

                                        //Get all Candidate Certifications
                                        db.query(Resume.getAllCertificationByResumeIdQuery(resume_id), (err, data) => {
                                            if (err) { logger.log(err) } else {
                                                var certification = data;
                                                logger.log("certification - ")
                                                logger.log(certification);

                                                //Get all Candidate Specializations
                                                db.query(Resume.getAllSpecializationByResumeIdQuery(resume_id), (err, data) => {
                                                    if (err) { logger.log(err) } else {
                                                        var specialization = data;
                                                        logger.log("specialization - ")
                                                        logger.log(specialization);

                                                        //Get all Candidate Skills
                                                        db.query(Resume.getAllSkillByResumeIdQuery(resume_id), (err, data) => {
                                                            if (err) { logger.log(err) } else {
                                                                var skills = data;
                                                                logger.log("skills - ")
                                                                logger.log(skills);

                                                                helpers.calculateProfilePercentage(userData.user_id, userData, resume, education, work_experience,
                                                                    certification, skills);

                                                                res.status(200).json({
                                                                    userData: userData,
                                                                    resume: resume,
                                                                    education: education,
                                                                    work_experience: work_experience,
                                                                    certification: certification,
                                                                    specialization: specialization,
                                                                    skills: skills,
                                                                    state: state_name,
                                                                    country: country_name
                                                                });
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })

                                    }
                                })
                            }
                        })
                    }
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.get('/find-a-job', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        logger.log("find-a-job")
        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        res.render('candidate_find_a_job', {
            view: 'find-a-job',
            data: userData
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get('/job-applications', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        logger.log("job-applications")
        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        res.render('candidate_job_applications', {
            view: 'job-applications',
            data: userData
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get('/recommended-jobs', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        logger.log("recommended-jobs")

        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        res.render('candidate_recommended_jobs', {
            view: 'recommended-jobs',
            data: userData
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get("/get-candidate-activity-history", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        var user = new User();
        db.query(user.getUserActivityHistory(user_id), (err, data) => {
            if (err) { logger.log(err) } else {
                for (var i = 0; i < data.length; i++) {
                    data[i].date_time_ago = helpers.getCurrentTimeAgo(data[i].date_created);
                }
                res.status(200).json({
                    message: "Activity History found.",
                    activityHistory: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.get("/get-candidate-statistics", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        var user = new User();
        db.query(user.getCountOfCandidateApplications(user_id), (err, data) => {
            if (err) { logger.log(err) } else {
                var candidateJobApplicationsCount = data[0].count;

                db.query(user.getCountOfCandidateSavedJobs(user_id), (err, data) => {
                    if (err) { logger.log(err) } else {
                        var candidateSavedJobsCount = data[0].count;

                        var job = new Job();
                        job.jobRecommendationsCount(user_id, (err, data) => {
                            if (err) { logger.log(err) } else {
                                var candidateRecommendedJobsCount = data;

                                res.status(200).json({
                                    message: "Candidate Statistics.",
                                    jobApplicationsCount: candidateJobApplicationsCount,
                                    savedJobsCount: candidateSavedJobsCount,
                                    recommendedJobsCount: candidateRecommendedJobsCount
                                });
                            }
                        });
                    }
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post("/upload-resume", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var user = req.session.passport.user;

        var form = new formidable.IncomingForm();

        /* form.on('fileBegin', function (name, file){
            if(file.name != ''){
                // Check if dir exist. If not create
                helpers.checkIfDirectoryExist(config.resume_upload_dir);

                var originalFileExtension = path.extname(file.name).toLowerCase();

                file.name = user.user_id + '_' + user.first_name + '_' + user.last_name + '_resume' +
                            originalFileExtension;

                file.path = config.resume_upload_dir + file.name;
            } 
        });

        form.on('file', function (name, file){
            if(file.name != ''){     
                //Upload additional file       
                logger.log('Uploaded ' + file.name);

                helpers.copyFile(file.path, config.main_assets_resume_dir);
            }
        }); */

        form.parse(req, function(err, fields, files) {
            if (err) { logger.log(err) } else {
                logger.log('##### fields #####');
                logger.log(fields);
                logger.log('##### files #####');
                logger.log(files);

                var azureHelper = new AzureHelper();
                azureHelper.uploadResumeToAzure(files);

                var user_id = user.user_id;
                var resume_id = fields.resume_id;
                var resume_url = '';

                if (files.resume.name != '') {
                    resume_url = files.resume.name;
                }

                var userObj = new User();
                db.query(userObj.updateResumeFileUrlQuery(user_id, resume_id, resume_url), (err, data) => {
                    if (err) {
                        logger.log(err);
                        helpers.saveActivityTrail(user_id, "Resume Upload",
                            "Resume upload failed");
                        res.redirect('/candidates/profile?q=resume&r=f');
                    } else {
                        helpers.saveActivityTrail(user_id, "Resume Upload", "Resume uploaded");
                        res.redirect('/candidates/profile?q=resume&r=s');
                    }
                });
            }
        });


        form.on('error', function(name, file) {
            if (file.name != '') {
                logger.log('Error Uploading file: ' + file.name);
            }
        });

        form.on('progress', function(bytesReceived, bytesExpected) {
            if (bytesReceived && bytesExpected) {
                var percent_complete = (bytesReceived / bytesExpected) * 100;
                logger.log(percent_complete.toFixed(2));
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post("/upload-profile-picture", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;

        var form = new formidable.IncomingForm();

        /* form.on('fileBegin', function (name, file){
            if(file.name != ''){
                // Check if dir exist. If not create
                helpers.checkIfDirectoryExist(config.profile_picture_upload_dir);

                var originalFileExtension = path.extname(file.name).toLowerCase();

                file.name = userData.user_id + '_' + userData.first_name + '_' + 
                            userData.last_name + '_profile_pic' + originalFileExtension;

                file.path = config.profile_picture_upload_dir + file.name;
            } 
        });  

        form.on('file', function (name, file){
            if(file.name != ''){     
                //Upload additional file       
                logger.log('Uploaded ' + file.name);
                helpers.copyFile(file.path, config.main_assets_profile_pic_dir);
            }
        }); */

        form.parse(req, function(err, fields, files) {
            if (err) { logger.log(err) } else {
                var azureHelper = new AzureHelper();
                azureHelper.uploadProfilePictureToAzure(files);

                var user_id = userData.user_id;
                var profile_pic_url = '';
                var full_profile_pic_url = '';

                if (files.profile_picture.name != '') {
                    profile_pic_url = files.profile_picture.name;
                    full_profile_pic_url = config.azure_profile_pic_url + profile_pic_url;
                }

                var user = new User();
                db.query(user.updateProfilePictureUrlQuery(user_id, full_profile_pic_url), (err, data) => {
                    if (err) {
                        logger.log(err);
                        helpers.saveActivityTrail(user_id, "Profile Picture Upload",
                            "Profile Picture upload failed");

                        res.status(200).json({
                            status: 'failed'
                        });

                    } else {
                        helpers.saveActivityTrail(user_id, "Profile Picture Upload", "Profile Picture Uploaded");

                        /*sessionStore.saveCandidateData(req, user_id, userData.user_uuid, userData.first_name, 
                            userData.last_name, userData.email, userData.phone_number, userData.user_role, 
                            userData.is_logged_in, userData.is_activated, userData.resume_id, userData.is_first_login, 
                            userData.gender, userData.tagline, userData.address, full_profile_pic_url); */

                        //.saveProfilePicture(req, full_profile_pic_url);

                        req.session.passport.user = {
                            user_id: userData.user_id,
                            user_uuid: userData.user_uuid,
                            first_name: userData.first_name,
                            last_name: userData.last_name,
                            username: userData.username,
                            other_name: userData.other_name,
                            email: userData.email,
                            phone_number: userData.phone_number,
                            address: userData.address,
                            state: userData.state,
                            country: userData.country,
                            gender: userData.gender,
                            dob: userData.dob,
                            profile_completeness: userData.profile_completeness,
                            photo_url: full_profile_pic_url,
                            social_media_id: userData.social_media_id,
                            company: userData.company,
                            tagline: userData.tagline,
                            industry: userData.industry,
                            password: userData.password,
                            last_login_time: userData.last_login_time,
                            last_login_ip_address: userData.last_login_ip_address,
                            date_created: userData.date_created,
                            is_activated: userData.is_activated,
                            is_password_set: userData.is_password_set,
                            activation_token: userData.activation_token,
                            invite_token: userData.invite_token,
                            is_invite_token_active: userData.is_invite_token_active,
                            is_first_login: userData.is_first_login,
                            role_id: userData.role_id,
                            resume_id: userData.resume_id
                        }


                        res.status(200).json({
                            status: 'success',
                            message: "Profile picture uploaded.",
                            photo_url: full_profile_pic_url
                        });
                    }
                });
            }
        });

        form.on('error', function(name, file) {
            if (file.name != '') {
                logger.log('Error Uploading file: ' + file.name);
            }
        });

        form.on('progress', function(bytesReceived, bytesExpected) {
            if (bytesReceived && bytesExpected) {
                var percent_complete = (bytesReceived / bytesExpected) * 100;
                logger.log(percent_complete.toFixed(2));
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.get('/saved-jobs', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        logger.log("saved-jobs")
        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        res.render('candidate_saved_jobs', {
            view: 'saved-jobs',
            data: userData
        });
    } catch (error) {
        logger.log(error);
    }

});

router.get('/get-all-saved-jobs', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        var user = new User();
        db.query(user.getAllCandidatesSavedJobs(user_id), (err, data) => {
            if (!err) {
                res.status(200).json({
                    message: "All Saved Jobs.",
                    jobs: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post("/remove-saved-job", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var saved_job_id = req.body.saved_job_id;

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        var job = new Job();
        db.query(job.removeSavedJob(saved_job_id), (err, data) => {
            if (!err) {
                if (data && data.affectedRows > 0) {

                    helpers.saveActivityTrail(user_id, "Job Removed",
                        "You removed a job from your saved jobs");

                    res.status(200).json({
                        message: 'Job Removed.',
                        affectedRows: data.affectedRows
                    });
                } else {
                    res.status(200).json({
                        message: "Job Not found."
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.get('/settings', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        logger.log("settings")
        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        logger.log(userData)

        var redirectFrom = req.query.f;
        var response = req.query.r;

        if (typeof redirectFrom != 'undefined' && redirectFrom) {
            if (redirectFrom == 'u_pp') {
                res.render('candidate_settings', {
                    view: 'settings',
                    data: userData,
                    showAlert: true,
                    alertMessage: response == 's' ? 'Profile picture updated successfully' : 'An error occurred',
                    alertType: response == 's' ? 'success' : 'error'
                });
            }

        } else {
            res.render('candidate_settings', {
                view: 'settings',
                data: userData
            });
        }
    } catch (error) {
        logger.log(error);
    }
});

router.post("/add", (req, res, next) => {
    try {
        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {
            if (err) { logger.log(err) } else {
                logger.log('##### fields #####');
                logger.log(fields);
                logger.log('##### files #####');
                logger.log(files);


                var captcha_response = fields['g-recaptcha-response'];

                if (captcha_response === undefined || captcha_response === '' || captcha_response === null) {
                    res.redirect('/register?v=c_f')
                } else {
                    var verificationUrl = config.captcha_verification_url_prefix + config.captcha_secret_key + "&response=" + captcha_response + "&remoteip=" + req.connection.remoteAddress;

                    request(verificationUrl, function(error, response, body) {
                        if (body === undefined || body === '' || body === null) {
                            res.redirect('/register?v=c_f')
                        } else {
                            body = JSON.parse(body);

                            if (body.success !== undefined && !body.success) {
                                res.redirect('/register?v=c_f')
                            } else {

                                addCandidateProcess(req, res, fields, files);
                            }
                        }
                    });
                }
            }
        });

        form.on('error', function(name, file) {
            if (file.name != '') {
                logger.log('Error Uploading file: ' + file.name);
            }
        });

        form.on('progress', function(bytesReceived, bytesExpected) {
            if (bytesReceived && bytesExpected) {
                var percent_complete = (bytesReceived / bytesExpected) * 100;
                logger.log(percent_complete.toFixed(2));
            }
        });

    } catch (error) {
        logger.log(error);
    }
});

function addCandidateProcess(req, res, fields, files) {
    try {
        'use strict';

        var azureHelper = new AzureHelper();
        azureHelper.uploadResumeToAzure(files);


        //var resume_id = fields.resume_id;
        var resume_url = '';

        if (files.resume.name != '') {
            resume_url = files.resume.name;
        }

        //read user information from request
        var user = new User();

        var user_uuid = uuidv1();
        var first_name = fields.first_name;
        var last_name = fields.last_name;
        var email = fields.email;
        var phone_number = fields.phone_number;
        var photo_url = fields.photo_url;
        var social_media_id = fields.social_media_id;
        var password = fields.password;

        var username = '';
        var other_name = '';
        var gender = fields.gender;
        var dob = fields.dob;
        var profile_completeness = '';
        var tagline = '';
        var address = '';

        var state = fields.state;
        var country = fields.country;
        var highest_qualification = fields.highest_qualification;
        var industry = fields.industry;
        var years_of_experience = fields.years_of_experience;

        db.query(User.checkIfEmailExist(email), (err, data) => {
            if (!err) {
                if (data && data.length > 0) {
                    res.redirect('/register?v=f');

                } else {
                    var is_activated = config.not_activated;
                    var plan_type = 0;
                    var means_of_id_url = '';
                    var recruiter_class = '';

                    db.query(user.createUserQuery(user_uuid, first_name, last_name, username, other_name, email, phone_number, gender,
                        dob, profile_completeness, photo_url, social_media_id, tagline, password, is_activated, means_of_id_url,
                        recruiter_class, plan_type, state, country, highest_qualification, industry, years_of_experience), (err, data) => {
                        if (!err) {
                            if (data) {
                                var user_id = data.insertId;
                                logger.log("User inserted");

                                db.query(User.insertUserRole(user_id, config.candidate_role_tag), (err, data) => {
                                    if (!err) {

                                        logger.log("UserRole inserted");

                                        var resume = new Resume();

                                        db.query(resume.createResumeQuery(user_id, resume_url), (err, data) => {
                                            if (!err) {
                                                logger.log("UserResume Created");

                                                var is_logged_in = true;
                                                var resume_id = data.insertId;
                                                var is_first_login = config.true;

                                                var userData = {
                                                    user_id: user_id,
                                                    user_uuid: user_uuid,
                                                    first_name: first_name,
                                                    last_name: last_name,
                                                    full_name: first_name + ' ' + last_name,
                                                    email: email,
                                                    phone_number: phone_number,
                                                    user_role: config.candidate_role_tag,
                                                    is_logged_in: is_logged_in,
                                                    is_activated: is_activated,
                                                    resume_id: resume_id,
                                                    is_first_login: is_first_login,
                                                    gender: gender,
                                                    tagline: tagline,
                                                    address: address,
                                                    profile_picture: photo_url
                                                };

                                                //Save Activity Trail
                                                helpers.saveActivityTrail(user_id, "Register", "Registration Completed.");

                                                var resumeEducation = {};
                                                var resumeWorkExperience = {};
                                                var resumeCertification = {};
                                                var resumeSkill = {};

                                                // process profile percentage
                                                helpers.calculateProfilePercentage(user_id, userData, resume,
                                                    resumeEducation, resumeWorkExperience, resumeCertification, resumeSkill);

                                                // send welcome mail
                                                var fullname = first_name + ' ' + last_name;
                                                mailer.sendCandidateWelcomeMail(req, user_id, fullname, email);

                                                // Redirect to login authentication to load session
                                                var redirect_link = '/auth/login?username=' + email + '&password=' + password;
                                                res.redirect(redirect_link);
                                            }
                                        })
                                    }
                                })
                            }
                        }
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }
}

router.post("/update", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        if (req.body.current_password) {
            changePassword(req, res, user_id, userData);
        } else {
            updateAllProfile(req, res, user_id, userData);
        }
    } catch (error) {
        logger.log(error);
    }
});

function updateAllProfile(req, res, user_id, userData) {
    try {
        var first_name = req.body.first_name;
        var last_name = req.body.last_name;
        var email = req.body.email;
        var phone_number = req.body.phone_number;
        var address = req.body.address;
        var gender = req.body.gender;
        var dob = req.body.dob;
        var tagline = req.body.tagline;
        var state = req.body.state;
        var country = req.body.country;
        var industry = req.body.industry;

        var user = new User();
        db.query(user.updateCandidateQuery(user_id, first_name, last_name, email, phone_number,
            address, gender, dob, tagline, state, country, industry), (err, data) => {
            if (!err) {
                if (data && data.affectedRows > 0) {

                    helpers.saveActivityTrail(user_id, "Profile Updated", "You updated your profile.");

                    //Save back to session
                    req.session.passport.user = {
                        user_id: userData.user_id,
                        user_uuid: userData.user_uuid,
                        first_name: first_name,
                        last_name: last_name,
                        username: userData.username,
                        other_name: userData.other_name,
                        email: email,
                        phone_number: phone_number,
                        address: address,
                        state: state,
                        country: country,
                        gender: gender,
                        dob: dob,
                        profile_completeness: userData.profile_completeness,
                        photo_url: userData.photo_url,
                        social_media_id: userData.social_media_id,
                        company: userData.company,
                        tagline: tagline,
                        industry: industry,
                        password: userData.password,
                        last_login_time: userData.last_login_time,
                        last_login_ip_address: userData.last_login_ip_address,
                        date_created: userData.date_created,
                        is_activated: userData.is_activated,
                        is_password_set: userData.is_password_set,
                        activation_token: userData.activation_token,
                        invite_token: userData.invite_token,
                        is_invite_token_active: userData.is_invite_token_active,
                        is_first_login: userData.is_first_login,
                        role_id: userData.role_id,
                        resume_id: userData.resume_id
                    }

                    userData = req.session.passport.user;

                    res.render('candidate_settings', {
                        view: 'settings',
                        data: userData,
                        showAlert: true,
                        alertMessage: "Profile updated successfully.",
                        alertType: "success"
                    });
                } else {
                    res.render('candidate_settings', {
                        view: 'settings',
                        data: userData,
                        showAlert: true,
                        alertMessage: "An error occurred updating your profile.",
                        alertType: "error"
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

}

function changePassword(req, res, user_id, userData) {
    try {
        logger.log("in update password ooo")
        var current_password = req.body.current_password;
        var new_password = req.body.new_password;

        db.query(User.getUserPasswordQuery(user_id), (err, data) => {
            if (err) { logger.log(err) } else if (!data) {
                logger.log("incorrect password");
                res.render('candidate_settings', {
                    view: 'settings',
                    data: userData,
                    showAlert: true,
                    alertMessage: "Incorrect Password",
                    alertType: "error"
                });
            } else {
                if (data.length > 0) {
                    if (!bcrypt.compareSync(current_password, data[0].password)) {
                        logger.log("Password does not match")

                        res.render('candidate_settings', {
                            view: 'settings',
                            data: userData,
                            showAlert: true,
                            alertMessage: "Password does not match",
                            alertType: "error"
                        });

                    } else {
                        logger.log("about to update")
                        db.query(User.updatePasswordQuery(user_id, new_password), (err, data) => {
                            if (!err) {
                                if (data && data.affectedRows > 0) {

                                    helpers.saveActivityTrail(user_id, "Password", "Password has been changed successfully.");

                                    res.render('candidate_settings', {
                                        view: 'settings',
                                        data: userData,
                                        showAlert: true,
                                        alertMessage: "Password changed Successfully",
                                        alertType: "success"
                                    });
                                } else {
                                    res.render('candidate_settings', {
                                        view: 'settings',
                                        data: userData,
                                        showAlert: true,
                                        alertMessage: "An Error Occurred. Please try again.",
                                        alertType: "error"
                                    });
                                }
                            }
                        });
                    }
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

}

router.post("/delete", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var userId = req.body.userId;

        db.query(User.deleteUserByIdQuery(userId), (err, data) => {
            if (!err) {
                if (data && data.affectedRows > 0) {
                    res.status(200).json({
                        message: `User deleted with id = ${userId}.`,
                        affectedRows: data.affectedRows
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

router.get("/get-profile-percentage", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        db.query(User.getProfilePercentage(user_id), (err, data) => {
            if (err) { logger.log(err) } else {
                res.status(200).json({
                    message: "Candidate profile percentage.",
                    profile_completeness: data[0].profile_completeness
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get('/cv-preview', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;

        console.log('before - ' + userData.photo_url)
        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);


        var user_photo_for_cv = userData.photo_url.replace(config.azure_profile_pic_url, '/uploads/images/profile_pictures/');
        console.log('user_photo_for_cv - ' + user_photo_for_cv)

        if (typeof userData.user_photo_for_cv != 'undefined' && userData.user_photo_for_cv != 'null' &&
            userData.user_photo_for_cv != null && userData.user_photo_for_cv != '') {

            var file = fs.createWriteStream(`${appRoot}/assets/` + user_photo_for_cv);
            userData.user_photo_for_cv = user_photo_for_cv;

            console.log('file - ' + file.path)

            var request = https.get(userData.photo_url, function(res) {
                res.pipe(file);
            });
        }




        var response = req.query.v;
        var transaction_reference = req.query.txf;

        if (typeof transaction_reference != 'undefined' && transaction_reference) {
            res.render('candidate_cv_preview', {
                showAlert: true,
                view: 'cv-fix',
                data: userData,
                transaction_reference: transaction_reference,
                alertMessage: response == 's' ? 'CV Generation Successful' : 'You new CV/Resume will download soon. This may take a while. Please wait',
                alertType: response == 's' ? 'success' : 'error'
            });
        } else {
            res.render('candidate_cv_preview', {
                view: 'cv-fix',
                data: userData
            });
        }


    } catch (error) {
        logger.log(error);
    }

});


module.exports = router;