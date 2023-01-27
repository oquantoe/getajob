var express = require('express');
var db = require('../db/database');
var Job = require('../models/job');
var User = require('../models/user');
var helpers = require('../config/helpers');
var config = require('./../config/config');
var formidable = require('formidable');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var mailer = require('../config/mail/mailer');
var logger = require('./../config/log4js');

var AzureHelper = require('../config/azure_helpers');

const router = express.Router();

router.use(cookieParser());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.use(session({
    secret: config.session_secret,
    resave: config.session_resave,
    key: config.session_key,
    saveUninitialized: config.session_save_uninitialized,
    cookie: { maxAge: config.session_cookie_max_age }
}));

router.get("/", (req, res, next) => {
    try {
        //helpers.checkifAuthenticated(req, res);

        db.query(Job.getAllJobsQuery(), (err, data) => {
            if (!err) {
                res.status(200).json({
                    message: "All Jobs listed.",
                    jobs: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get("/get-all-jobs", (req, res, next) => {
    try {
        //helpers.checkifAuthenticated(req, res);

        db.query(Job.getAllJobsQuery(), (err, data) => {
            if (!err) {
                for (var i = 0; i < data.length; i++) {
                    data[i].date_time_ago = helpers.getCurrentTimeAgo(data[i].date_created);
                }

                res.status(200).json({
                    message: "All Jobs listed.",
                    jobs: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get("/get-all-job-filters", (req, res, next) => {
    try {
        //helpers.checkifAuthenticated(req, res);

        db.query(Job.getAllIndustries(), (err, data) => {
            if (!err) {
                var allIndustry = data;

                db.query(Job.getAllStates(), (err, data) => {
                    if (!err) {
                        var allStates = data;

                        db.query(Job.getAllJobTypes(), (err, data) => {
                            if (!err) {
                                var allJobTypes = data;

                                db.query(Job.getAllJobCategories(), (err, data) => {
                                    if (!err) {
                                        var allJobCategories = data;

                                        db.query(Job.getAllSkills(), (err, data) => {
                                            if (!err) {
                                                var allSkills = data;

                                                res.status(200).json({
                                                    message: "All Job Filters.",
                                                    industries: allIndustry,
                                                    states: allStates,
                                                    jobTypes: allJobTypes,
                                                    jobCategories: allJobCategories,
                                                    skills: allSkills
                                                });
                                            }
                                        });
                                    }
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

router.get("/get-all-states", (req, res, next) => {
    try {
        //helpers.checkifAuthenticated(req, res);

        db.query(Job.getAllStates(), (err, data) => {
            if (!err) {
                var allStates = data;

                res.status(200).json({
                    message: "All States.",
                    states: allStates
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post("/get-all-states-by-country", (req, res, next) => {
    try {
        //helpers.checkifAuthenticated(req, res);

        var country_id = req.body.country_id;

        db.query(Job.getAllStatesByCountry(country_id), (err, data) => {
            if (!err) {
                var allStates = data;

                res.status(200).json({
                    message: "All States by country.",
                    states: allStates
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get("/get-all-job-types", (req, res, next) => {
    try {
        // helpers.checkifAuthenticated(req, res);

        db.query(Job.getAllJobTypes(), (err, data) => {
            if (!err) {
                var allJobTypes = data;

                res.status(200).json({
                    message: "All Job Types.",
                    job_types: allJobTypes
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get("/get-all-job-post-params", (req, res, next) => {
    try {
        //helpers.checkifAuthenticated(req, res);

        db.query(Job.getAllStates(), (err, data) => {
            if (!err) {
                var allStates = data;

                db.query(Job.getAllJobTypes(), (err, data) => {
                    if (!err) {
                        var allJobTypes = data;

                        db.query(Job.getAllJobCategories(), (err, data) => {
                            if (!err) {
                                var allJobCategories = data;

                                db.query(Job.getAllIndustries(), (err, data) => {
                                    if (!err) {
                                        var allIndustries = data;

                                        db.query(Job.getAllQualifications(), (err, data) => {
                                            if (!err) {
                                                var allQualifications = data;

                                                db.query(Job.getAllExperienceLevel(), (err, data) => {
                                                    if (!err) {
                                                        var allExperienceLevel = data;

                                                        db.query(Job.getAllSkill(), (err, data) => {
                                                            if (!err) {
                                                                var allSkills = data;

                                                                db.query(Job.getAllShortlistParams(), (err, data) => {
                                                                    if (!err) {
                                                                        var allShortlistParams = data;

                                                                        db.query(Job.getAllCountries(), (err, data) => {
                                                                            if (!err) {
                                                                                var allCountries = data;

                                                                                db.query(Job.getAllNGStates(), (err, data) => {
                                                                                    if (!err) {
                                                                                        var allNGStates = data;

                                                                                        res.status(200).json({
                                                                                            message: "All Data.",
                                                                                            states: allStates,
                                                                                            countries: allCountries,
                                                                                            jobTypes: allJobTypes,
                                                                                            jobCategories: allJobCategories,
                                                                                            industries: allIndustries,
                                                                                            qualifications: allQualifications,
                                                                                            experienceLevel: allExperienceLevel,
                                                                                            skills: allSkills,
                                                                                            shortlistParams: allShortlistParams,
                                                                                            ngStates: allNGStates
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
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

router.get("/get-all-cv-search-params", (req, res, next) => {
    try {
        //helpers.checkifAuthenticated(req, res);

        db.query(Job.getAllStates(), (err, data) => {
            if (!err) {
                var allStates = data;

                db.query(Job.getAllQualifications(), (err, data) => {
                    if (!err) {
                        var allQualifications = data;

                        res.status(200).json({
                            message: "All Data.",
                            states: allStates,
                            qualifications: allQualifications
                        });
                    }
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get("/get-all-industries", (req, res, next) => {
    try {
        //helpers.checkifAuthenticated(req, res);

        db.query(Job.getAllIndustries(), (err, data) => {
            if (!err) {
                var allIndustries = data;

                res.status(200).json({
                    message: "All Data.",
                    industries: allIndustries
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get("/get-all-application-status", (req, res, next) => {
    try {
        //helpers.checkifAuthenticated(req, res);

        db.query(Job.getAllApplicationStatus(), (err, data) => {
            if (!err) {
                var allApplicationStatus = data;

                res.status(200).json({
                    message: "All Application Status.",
                    applicationStatus: allApplicationStatus
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get("/get-all-candidate-job-applications", (req, res, next) => {
    try {
        //helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        db.query(Job.getAllCandidateJobApplications(user_id), (err, data) => {
            if (!err) {

                for (var i = 0; i < data.length; i++) {
                    data[i].date_applied = helpers.formatDateTime(data[i].date_created);
                }

                res.status(200).json({
                    message: "All Job Applications.",
                    jobs: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get("/filter-jobs", (req, res, next) => {
    try {
        //helpers.checkifAuthenticated(req, res);

        var industry_params = req.query.f_industry;
        var skill_params = req.query.f_skill;
        var state_params = req.query.f_state;
        var job_type_params = req.query.f_job_type;
        var job_category_params = req.query.f_job_category;

        logger.log(industry_params)
        logger.log(state_params)
        logger.log(job_type_params)
        logger.log(job_category_params)

        var job = new Job();
        var filterJobsQuery = job.getFilterJobsProcessQuery(industry_params, skill_params, state_params,
            job_type_params, job_category_params);

        db.query(filterJobsQuery, (err, data) => {
            if (err) { logger.log(err) } else {
                for (var i = 0; i < data.length; i++) {
                    data[i].date_time_ago = helpers.getCurrentTimeAgo(data[i].date_created);
                }

                res.status(200).json({
                    message: "All Filtered Jobs listed.",
                    jobs: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.get("/keyword-search", (req, res, next) => {
    try {
        //helpers.checkifAuthenticated(req, res);

        var keyword = req.query.keyword;

        db.query(Job.keywordSearch(keyword), (err, data) => {
            if (!err) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        data[i].date_time_ago = helpers.getCurrentTimeAgo(data[i].date_created);
                    }

                    res.status(200).json({
                        message: "All Jobs listed.",
                        jobs: data
                    });
                } else {
                    res.status(200).json({
                        message: "Jobs Not found.",
                        jobs: data
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get("/get-temp-skilled-jobs", (req, res, next) => {
    try {
        //helpers.checkifAuthenticated(req, res);

        var job = new Job();
        db.query(job.getTempLatestJobs(), (err, data) => {
            if (err) { logger.log(err) } else {
                for (var i = 0; i < data.length; i++) {
                    data[i].date_time_ago = helpers.getCurrentTimeAgo(data[i].date_created);
                }

                res.status(200).json({
                    message: "All Jobs listed.",
                    jobs: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get("/get-sterling-oil-jobs", (req, res, next) => {
    try {
        //helpers.checkifAuthenticated(req, res);

        var job = new Job();
        db.query(job.getTempSterlingJobs(), (err, data) => {
            if (err) { logger.log(err) } else {
                for (var i = 0; i < data.length; i++) {
                    data[i].date_time_ago = helpers.getCurrentTimeAgo(data[i].date_created);
                }

                res.status(200).json({
                    message: "All Jobs listed.",
                    jobs: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get("/get-candidate-job-recommendations", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        var filter = req.query.filter;

        var job = new Job();
        if (typeof filter != 'undefined' && filter) {
            job.jobRecommendationProcessWithFilter(user_id, filter, (err, data) => {
                if (err) { logger.log(err) } else {
                    for (var i = 0; i < data.length; i++) {
                        data[i].date_time_ago = helpers.getCurrentTimeAgo(data[i].date_created);

                        var job_id = data[i].job_id;

                        //var total_score = job.percentageMatchProcess(user_id, job_id);
                        //var percentage_match = Math.round(((total_score / 40) * 100) * 10) /10;  // 40 is the highest score
                        //logger.log('percentage_match - ' + percentage_match);

                        //data[i].percentage_score = percentage_match;
                    }

                    res.status(200).json({
                        message: "Jobs found.",
                        recommendedJobs: data
                    });
                }
            });
        } else {
            job.jobRecommendationProcess(user_id, (err, data) => {
                if (err) { logger.log(err) } else {
                    for (var i = 0; i < data.length; i++) {
                        data[i].date_time_ago = helpers.getCurrentTimeAgo(data[i].date_created);

                        var job_id = data[i].job_id;

                        //var total_score = job.percentageMatchProcess(user_id, job_id);
                        //var percentage_match = Math.round(((total_score / 40) * 100) * 10) /10;  // 40 is the highest score
                        //logger.log('percentage_match - ' + percentage_match);

                        //data[i].percentage_score = percentage_match;
                    }

                    res.status(200).json({
                        message: "Jobs found.",
                        recommendedJobs: data
                    });
                }
            });
        }
    } catch (error) {
        logger.log(error);
    }

});

router.get("/get-candidate-job-recommendations-for-dashboard", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        var job = new Job();
        job.jobRecommendationProcessForDashboard(user_id, (err, data) => {
            if (err) { logger.log(err) } else {
                for (var i = 0; i < data.length; i++) {
                    data[i].date_time_ago = helpers.getCurrentTimeAgo(data[i].date_created);

                    var job_id = data[i].job_id;

                    //var total_score = job.percentageMatchProcess(user_id, job_id);
                    //var percentage_match = Math.round(((total_score / 40) * 100) * 10) /10;  // 40 is the highest score
                    //logger.log('percentage_match - ' + percentage_match);

                    //data[i].percentage_score = percentage_match;

                    if (typeof data[i].company_logo_url != 'undefined' && data[i].company_logo_url != 'null' &&
                        data[i].company_logo_url != null && data[i].company_logo_url != '') {

                        data[i].company_logo_url = data[i].company_logo_url.replace('/uploads/images/company_logos/', config.azure_company_logo_url);
                    }

                }

                res.status(200).json({
                    message: "Jobs found.",
                    recommendedJobs: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.get('/get-last-5-jobs', function(req, res) {
    try {
        //helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        db.query(Job.getRecruiterLast5PostedJobs(user_id), (err, data) => {
            if (err) { logger.log(err) } else {
                for (var i = 0; i < data.length; i++) {
                    data[i].date_time_ago = helpers.getCurrentTimeAgo(data[i].date_created);
                }
                res.status(200).json({
                    message: "Posted Jobs.",
                    jobs: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.get('/get-all-recruiter-posted-jobs', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        db.query(Job.getAllRecruiterPostedJobs(user_id), (err, data) => {
            if (err) { logger.log(err) } else {
                for (var i = 0; i < data.length; i++) {
                    data[i].date_time_ago = helpers.getCurrentTimeAgo(data[i].date_created);
                    data[i].application_deadline = helpers.formatDateTime(data[i].application_deadline);
                }
                res.status(200).json({
                    message: "Posted Jobs.",
                    jobs: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.get('/job-detail/:jobId', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        var jobId = req.params.jobId;
        var p = req.query.p;

        db.query(Job.getJobByIdQuery(jobId), (err, data) => {
            if (!err) {
                // sAVE data[0] to a var and checkIfUserAppliedToJob

                var jobData = data[0];

                if (jobData) {
                    jobData.job_description = jobData.job_description.substring(0, jobData.job_description.length - 1);
                    /*jobData.job_responsibilities = jobData.job_responsibilities.substring(0, jobData.job_responsibilities.length - 1)
    
                    if (typeof jobData.job_responsibilities === 'undefined' || jobData.job_responsibilities == '' ||
                        jobData.job_responsibilities == null || jobData.job_responsibilities == 'null') {
    
                        jobData.job_description = jobData.job_description;
                    } else {
                        jobData.job_description = jobData.job_description + "<br><br><h6>Job Responsibilities</h6><br>" +
                            jobData.job_responsibilities;
                    }*/

                    jobData.job_description = helpers.unescapeHTML(jobData.job_description);

                    jobData.application_deadline = helpers.checkApplicationDeadline(jobData.application_deadline);

                    jobData.company_logo_url = jobData.company_logo_url.replace('/uploads/images/company_logos/', config.azure_company_logo_url);

                    var job = new Job();
                    db.query(job.checkIfUserAppliedToJob(jobId, user_id), (err, data) => {
                        if (!err) {
                            if (data && data.length > 0) {
                                var userData = req.session.passport.user;

                                if (typeof p != 'undefined' && p) {
                                    if (p == 's') {
                                        res.render('candidate_job_detail', {
                                            view: 'find-a-job',
                                            data: userData,
                                            jobData: jobData,
                                            showAlert: true,
                                            alertMessage: "Job Application Successful",
                                            alertType: "success"
                                        });
                                    } else if (p == 'f') {
                                        res.render('candidate_job_detail', {
                                            view: 'find-a-job',
                                            data: userData,
                                            jobData: jobData,
                                            showAlert: true,
                                            alertMessage: "Job Application Failed.",
                                            alertType: "error"
                                        });
                                    }
                                } else {
                                    console.log(userData)
                                    res.render('candidate_job_detail', {
                                        view: 'find-a-job',
                                        data: userData,
                                        jobData: jobData
                                    });
                                }

                            } else {
                                res.status(200).json({
                                    message: "Job Not found."
                                });
                            }
                        }
                    });
                } else {
                    if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
                        var userData = req.session.passport.user;
                        res.status(404).render('404', {
                            userAuthenticated: 'true',
                            data: userData
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

router.post('/check-application-status', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var job_id = req.body.job_id;
        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        var job = new Job();
        db.query(job.checkIfUserAppliedToJob(job_id, user_id), (err, data) => {
            if (err) { logger.log(err) } else {
                res.status(200).json({
                    message: "Application Status",
                    application_status: data[0].count
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post("/processapply", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var user = req.session.passport.user;

        var form = new formidable.IncomingForm();

        /* form.on('fileBegin', function (name, file){
            if(file.name != ''){
                // Check if dir exist. If not create
                helpers.checkIfDirectoryExist(config.additional_resume_upload_dir);

                var originalFileExtension = path.extname(file.name).toLowerCase();

                file.name = user.user_id + '_' + user.first_name + '_' + user.last_name + '_additional_file' +
                            originalFileExtension;

                file.path = config.additional_resume_upload_dir + file.name;
            } 
        });

        form.on('file', function (name, file){
            if(file.name != ''){     
                //Upload additional file       
                logger.log('Uploaded ' + file.name);
                helpers.copyFile(file.path, config.main_assets_additional_resume_dir);
            }
        }); */

        form.parse(req, function(err, fields, files) {
            if (err) { logger.log(err) } else {
                logger.log('##### fields #####');
                logger.log(fields);
                logger.log('##### files #####');
                logger.log(files);

                var azureHelper = new AzureHelper();
                azureHelper.uploadAdditionalFilesToAzure(files);

                var user_id = user.user_id;
                var user_email = user.email;
                var user_full_name = user.first_name + ' ' + user.last_name;

                var job_id = fields.job_id;
                var job_title = fields.job_title;
                var cover_letter = fields.cover_letter;
                var additional_resume_url = '';

                if (files.additional_file.name != '') {
                    additional_resume_url = config.azure_additional_files_url + files.additional_file.name;
                }

                cover_letter = cover_letter.replace("'", "\\'");

                var job = new Job();
                db.query(job.applyForJobQuery(job_id, user_id, cover_letter, additional_resume_url), (err, data) => {
                    if (err) {
                        logger.log(err);
                        helpers.saveActivityTrail(user_id, "Job Application", "Job Application to - " + job_title + " failed");
                        res.redirect('/jobs/job-detail/' + job_id + '?p=f');
                    } else {
                        helpers.saveActivityTrail(user_id, "Job Application", "You applied to the " + job_title + " role");

                        mailer.sendJobApplicationMail(user_full_name, user_email, job_title);

                        startAutoShortlistProcess(req, res, user_id, job_id);

                        res.redirect('/jobs/job-detail/' + job_id + '?p=s');
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

router.get('/apply/:jobId', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var jobId = req.params.jobId;
        var userData = req.session.passport.user;

        var user = new User();
        db.query(user.getCandidateCV(userData.user_id), (err, data) => {
            if (!err) {
                var candidate_resume_url =
                    typeof data[0].resume_file_url != 'undefined' && data[0].resume_file_url &&
                    data[0].resume_file_url != '' && data[0].resume_file_url != null ?
                    data[0].resume_file_url : 'false';


                db.query(Job.getJobByIdQuery(jobId), (err, data) => {
                    if (!err) {
                        if (data && data.length > 0) {
                            res.render('job_application_page', {
                                view: 'find-a-job',
                                data: userData,
                                jobData: data[0],
                                candidate_resume_url: candidate_resume_url
                            });
                        } else {
                            res.status(200).json({
                                message: "Job Not found."
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

router.post("/create-job", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var job_title = req.body.job_title;
        var job_type = req.body.job_type;
        var job_category = req.body.job_category;
        var location = req.body.location;
        var industry = req.body.industry;
        var job_description = req.body.job_description;
        var job_responsibilities = req.body.job_responsibilities;
        var min_qualification = req.body.min_qualification;
        var experience_level = req.body.experience_level;
        var min_year_of_experience = req.body.min_year_of_experience;
        var max_year_of_experience = req.body.max_year_of_experience;
        var expected_salary = req.body.expected_salary;
        var gender_type = req.body.gender_type;
        var application_deadline = req.body.application_deadline;
        var minimum_age = req.body.minimum_age;
        var maximum_age = req.body.maximum_age;
        var required_skills = req.body.required_skills;
        var shortlist_params = req.body.shortlist_params;
        var application_channel = req.body.application_channel;
        var external_application_link = req.body.external_application_link;

        var userData = req.session.passport.user;
        var user_id = userData.user_id;
        var recruiter_full_name = userData.company_name;
        var recruiter_email = userData.email;
        var company_id = userData.company_id;

        var default_country_id = 161; //Make Nigeria default

        var is_approved = config.false;
        var status = config.pending;

        if (userData.role_id == config.admin_role_tag) {
            is_approved = config.true;
            status = config.active;
        }

        var job = new Job();
        db.query(job.createJobQuery(job_title, company_id, default_country_id, job_type, job_category, location,
            industry, job_description, job_responsibilities, min_qualification, experience_level, min_year_of_experience,
            max_year_of_experience, expected_salary, gender_type, application_deadline, minimum_age, maximum_age,
            required_skills, shortlist_params, application_channel, external_application_link,
            user_id, is_approved, status), (err, data) => {

            if (!err) {
                helpers.saveActivityTrail(user_id, "Job Posted", 'Your Job ' + job_title + ' has been posted.');

                var job_id = data.insertId;

                logger.log("job_id - " + job_id)

                mailer.sendJobPostedMail(req, recruiter_email, recruiter_full_name, job_id, job_title);

                res.status(200).json({
                    message: "Job added.",
                    jobId: data.insertId
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post("/edit-job-post", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var job_id = req.body.job_id;
        var job_title = req.body.job_title;
        var job_type = req.body.job_type;
        var job_category = req.body.job_category;
        var location = req.body.location;
        var industry = req.body.industry;
        var job_description = req.body.job_description;
        var job_responsibilities = req.body.job_responsibilities;
        var min_qualification = req.body.min_qualification;
        var experience_level = req.body.experience_level;
        var min_year_of_experience = req.body.min_year_of_experience;
        var max_year_of_experience = req.body.max_year_of_experience;
        var expected_salary = req.body.expected_salary;
        var gender_type = req.body.gender_type;
        var application_deadline = req.body.application_deadline;
        var minimum_age = req.body.minimum_age;
        var maximum_age = req.body.maximum_age;
        var required_skills = req.body.required_skills;
        var shortlist_params = req.body.shortlist_params;
        var application_channel = req.body.application_channel;
        var external_application_link = req.body.external_application_link;

        var recruiterData = req.session.passport.user;
        var user_id = recruiterData.user_id;
        var recruiter_full_name = recruiterData.full_name;
        var recruiter_email = recruiterData.email;
        var company_id = recruiterData.company_id;

        var default_country_id = 161; //Make Nigeria default

        var job = new Job();
        db.query(job.editJobPostQuery(job_id, job_title, job_type, job_category, location, industry, job_description,
            job_responsibilities, min_qualification, experience_level, min_year_of_experience,
            max_year_of_experience, expected_salary, gender_type, application_deadline, minimum_age, maximum_age,
            required_skills, shortlist_params, application_channel, external_application_link), (err, data) => {

            if (!err) {
                helpers.saveActivityTrail(user_id, "Job Post Edited", 'Your edited your job post: (' + job_title + ').');

                //var job_id = data.insertId;

                //logger.log("job_id - " + job_id)

                //mailer.sendJobPostedMail(req, recruiter_email, recruiter_full_name, job_id, job_title);

                res.status(200).json({
                    message: "Job edited.",
                    result: true
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post("/search-job-old", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var keyword = req.body.keyword;
        var industry = req.body.industry;
        //var state = req.body.state;
        //var country = req.body.country;
        var location = req.body.location;

        db.query(Job.searchJobsQuery(keyword, location), (err, data) => {
            if (!err) {
                if (data.length > 0) {
                    res.status(200).json({
                        message: `Jobs found.`,
                        searchedJobs: data
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

router.post("/search-job", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var keyword = req.body.keyword;
        var industry = req.body.industry;
        //var state = req.body.state;
        //var country = req.body.country;
        var location = req.body.location;

        res.redirect('/find-a-job?search=' + keyword);
    } catch (error) {
        logger.log(error);
    }

});

router.post("/save-job", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        //read user information from request
        var job_id = req.body.job_id;
        var user_id = req.body.user_id;

        db.query(Job.saveJobQuery(job_id, user_id), (err, data) => {
            helpers.saveActivityTrail(user_id, "Job Saved", "You saved a Job post with job_id - " + job_id);
            res.status(200).json({
                message: "Job added to wishlist.",
                savedJobId: data.insertId
            });
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post("/delete-job", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var job_id = req.body.job_id;
        var job_title = req.body.job_title;

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        db.query(Job.deleteJobByIdQuery(job_id), (err, data) => {
            if (!err) {
                if (data && data.affectedRows > 0) {

                    helpers.saveActivityTrail(user_id, "Job Deleted", "You deleted a Job post titled (" + job_title + ")");

                    res.status(200).json({
                        message: 'Job deleted.',
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

router.post("/get-all-job-applicants", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var job_id = req.body.job_id;

        db.query(Job.getAllJobApplicants(job_id), (err, data) => {
            if (!err) {
                var applicants_list = data;

                for (var i = 0; i < applicants_list.length; i++) {
                    applicants_list[i].date_created = helpers.formatDateTime(applicants_list[i].date_created);
                    applicants_list[i].date_applied = helpers.formatDateTime(applicants_list[i].date_applied);
                    applicants_list[i].photo_url = data[i].photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);
                }

                res.status(200).json({
                    message: "All Applicants",
                    applicants: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post("/get-all-shortlisted-job-applicants", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var job_id = req.body.job_id;

        db.query(Job.getAllShortlistedJobApplicants(job_id), (err, data) => {
            if (!err) {
                for (var i = 0; i < data.length; i++) {
                    data[i].date_created = helpers.formatDateTime(data[i].date_created);
                    data[i].date_applied = helpers.formatDateTime(data[i].date_applied);
                    data[i].photo_url = data[i].photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);
                }
                res.status(200).json({
                    message: "All Shortlisted Applicants",
                    applicants: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post("/get-all-rejected-job-applicants", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var job_id = req.body.job_id;

        db.query(Job.getAllRejectedJobApplicants(job_id), (err, data) => {
            if (!err) {
                for (var i = 0; i < data.length; i++) {
                    data[i].date_created = helpers.formatDateTime(data[i].date_created);
                    data[i].date_applied = helpers.formatDateTime(data[i].date_applied);
                    data[i].photo_url = data[i].photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);
                }
                res.status(200).json({
                    message: "All Rejected Applicants",
                    applicants: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

function startAutoShortlistProcess(req, res, user_id, job_id) {
    try {
        db.query(Job.getJobNameByIdQuery(job_id), (err, data) => {
            if (err) { logger.log(err) } else {
                var job_name = data[0].job_name;

                var job = new Job();
                job.newShortlistProcess(req, res, user_id, job_id, job_name);
            }
        })
    } catch (error) {
        logger.log(error);
    }
}

router.get('/get-all-approved-jobs', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        db.query(Job.getAllAdminApprovedJobs(user_id), (err, data) => {
            if (err) { logger.log(err) } else {
                for (var i = 0; i < data.length; i++) {
                    data[i].date_time_ago = helpers.getCurrentTimeAgo(data[i].date_created);
                    data[i].application_deadline = helpers.formatDateTime(data[i].application_deadline);
                }
                res.status(200).json({
                    message: "Approved Jobs.",
                    jobs: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get('/get-all-pending-jobs', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        db.query(Job.getAllAdminPendingJobs(user_id), (err, data) => {
            if (err) { logger.log(err) } else {
                for (var i = 0; i < data.length; i++) {
                    data[i].date_time_ago = helpers.getCurrentTimeAgo(data[i].date_created);
                    data[i].application_deadline = helpers.formatDateTime(data[i].application_deadline);
                }
                res.status(200).json({
                    message: "Pending Jobs.",
                    jobs: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get('/get-count-all-jobs', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        db.query(Job.getCountOfAllJobs(), (err, data) => {
            if (err) { logger.log(err) } else {

                var total_job_count = data[0].total_job_count;

                res.status(200).json({
                    message: "Total job count.",
                    total_job_count: total_job_count
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get("/:jobId", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var jobId = req.params.jobId;

        db.query(Job.getJobByIdQuery(jobId), (err, data) => {
            if (!err) {
                if (data && data.length > 0) {

                    res.status(200).json({
                        message: "Job found.",
                        job: data
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

module.exports = router;