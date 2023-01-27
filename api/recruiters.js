var express = require('express');
var db = require('../db/database');
var User = require('../models/user');
var Job = require('./../models/job');
var Resume = require('./../models/resume');
var Assessment = require('./../models/assessment');
var uuidv1 = require('uuid/v1');
var config = require('../config/config');
var excel = require('../config/excel');
var sessionStore = require('../config/session_store');
var helpers = require('../config/helpers');
var mailer = require('../config/mail/mailer');
var logger = require('./../config/log4js');
var formidable = require('formidable');
var path = require('path');

var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcryptjs');

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

router.get("/", (req, res, next) => {});

router.get('/dashboard', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        var redirectFrom = req.query.f;
        var response = req.query.r;

        if (typeof redirectFrom != 'undefined' && redirectFrom) {
            if (redirectFrom == 's_u') {
                res.render('recruiter_dashboard', {
                    view: 'dashboard',
                    data: userData,
                    showAlert: true,
                    alertMessage: response == 's' ? 'Subscription Plan Upgraded Successfully' : 'Subscription Plan failed to upgrade. Please try again.',
                    alertType: response == 's' ? 'success' : 'error'
                });
            }
        } else {
            res.render('recruiter_dashboard', {
                view: 'dashboard',
                data: userData
            });
        }

    } catch (error) {
        logger.log(error);
    }
});

router.get('/settings', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        var redirectFrom = req.query.f;
        var response = req.query.r;

        if (typeof redirectFrom != 'undefined' && redirectFrom) {
            //If redirect is from Update User Profile
            if (redirectFrom == 'u_p') {
                res.render('recruiter_settings', {
                    view: 'settings',
                    data: userData,
                    userInfo: userData,
                    showAlert: true,
                    alertMessage: response == 's' ? 'Profile Successfully Updated' : 'Profile couldn\'t update',
                    alertType: response == 's' ? 'success' : 'error'
                });
            }

            if (redirectFrom == 'u_cp') {
                res.render('recruiter_settings', {
                    view: 'settings',
                    data: userData,
                    userInfo: userData,
                    showAlert: true,
                    alertMessage: response == 's' ? 'Company Profile Updated Successfully' : 'Company Profile couldn\'t update',
                    alertType: response == 's' ? 'success' : 'error'
                });
            }

            //If redirect is from Change user password
            else if (redirectFrom == 'p') {
                var message_to_show = '';

                if (response == 'p_s') {
                    message_to_show = 'Password changed successfully';
                } else if (response == 'p_e') {
                    message_to_show = 'An error occured changing your password';
                } else if (response == 'p_m') {
                    message_to_show = 'Your current password does not match with our records';
                } else if (response == 'i_p') {
                    message_to_show = 'Incorrect Password';
                }

                res.render('recruiter_settings', {
                    view: 'settings',
                    data: userData,
                    userInfo: userData,
                    showAlert: true,
                    alertMessage: message_to_show,
                    alertType: response == 'p_s' ? 'success' : 'error'
                });
            }

            //If redirect is from Add Team members
            else if (redirectFrom == 'a_t') {
                var message_to_show = '';

                if (response == 's') {
                    message_to_show = 'Team mates added successfully';
                } else if (response == 'u_e') {
                    message_to_show = 'A user already exist with this email';
                }

                res.render('recruiter_settings', {
                    view: 'settings',
                    data: userData,
                    userInfo: userData,
                    showAlert: true,
                    alertMessage: message_to_show,
                    alertType: response == 's' ? 'success' : 'error'
                });
            }

        } else {
            res.render('recruiter_settings', {
                view: 'settings',
                data: userData,
                userInfo: userData
            });
        }
    } catch (error) {
        logger.log(error);
    }

});

router.post('/get-company-info', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var company_id = req.body.company_id;

        var user = new User();
        db.query(user.getCompanyInfoByCompanyId(company_id), (err, data) => {

            var companyInfo = data[0];

            if (!err) {
                res.status(200).json({
                    message: "Company Information.",
                    companyInfo: companyInfo
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.get('/saved-candidates', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        res.render('recruiter_saved_candidates', {
            view: 'saved-candidates',
            data: userData
        });
    } catch (error) {
        logger.log(error);
    }

});

router.get('/upgrade-plan', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        res.render('recruiter_upgrade_plan', {
            view: 'upgrade-plan',
            data: userData
        });
    } catch (error) {
        logger.log(error);
    }

});

router.get('/get-all-saved-candidates', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        var user = new User();
        db.query(user.getAllRecruitersSavedCandidates(user_id), (err, data) => {
            if (!err) {
                for (var i = 0; i < data.length; i++) {
                    data[i].photo_url = data[i].photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);
                }
                res.status(200).json({
                    message: "All Saved Candidates.",
                    candidates: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.get('/get-searched-talents', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        'use strict';
        var all_resume_info = [];

        var talents = sessionStore.getAllTalentSearchResults();

        logger.log('$$$$$$$$$$ - talents - $$$$$$$$$$$$');
        logger.log(talents.length);

        for (var i = 0; i < talents.length; i++) {
            db.query(Resume.getResumeByUserIdQuery(talents[i].user_id), (err, data) => {
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


                                    all_resume_info = [{
                                        resume_info: resume,
                                        education: education,
                                        work_experience: work_experience
                                    }]

                                    talents[i].resume_info = all_resume_info;

                                }
                            });
                        }
                    });
                }
            });
        }

        res.status(200).json({
            message: "All searched talents.",
            talents: talents,
            resume_info: all_resume_info
        });
    } catch (error) {
        logger.log(error);
    }

});

router.get('/talent-pool-old', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        res.render('recruiter_talent_pool_old', {
            view: 'talent-pool',
            data: userData
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get('/talent-pool', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        res.render('recruiter_talent_pool', {
            view: 'talent-pool',
            data: userData
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post('/go-to-search-talents', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var job_title = req.body.job_title;
        var keyword = req.body.keyword;
        var location = req.body.location;
        var education_level = req.body.education_level;

        res.redirect('/recruiters/talent-pool?job_title_param=' + job_title + '&keyword_param=' + keyword +
            '&location_param=' + location + '&education_param=' + education_level);
    } catch (error) {
        logger.log(error);
    }

});

router.post('/search-talents', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var job_title = req.body.job_title;
        var keyword = req.body.keyword;
        var location = req.body.location;
        var education_level = req.body.education_level;

        var userData = req.session.passport.user;

        //searchTalents(job_title, keyword, location, education_level, res);
        newSearch(res, job_title, keyword, location, education_level);
    } catch (error) {
        logger.log(error);
    }
});

function newSearch(res, job_title_search_param, keyword_search_param, location_search_param,
    education_level_search_param) {

    try {
        var job = new Job();
        db.query(job.searchTalentPool(job_title_search_param, keyword_search_param, location_search_param,
            education_level_search_param), (err, data) => {
            if (!err) {
                logger.log("result from query is : " + data.length);

                for (var i = 0; i < data.length; i++) {
                    data[i].date_time_ago = helpers.getCurrentTimeAgo(data[i].date_created);
                    data[i].application_date = helpers.formatDateTime(data[i].application_date);
                    data[i].photo_url = data[i].photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);
                }

                res.status(200).json({
                    message: "All Talents.",
                    talents: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
}

function newSearchOld(job_title_search_param, keyword_search_param, location_search_param,
    education_level_search_param) {

    try {
        var job = new Job();
        db.query(job.searchTagline(job_title_search_param), (err, data) => {
            if (!err) {
                logger.log("result from tagline query is : " + data.length);

                var search_tagline_result = data;

                db.query(job.searchWERolename(job_title_search_param), (err, data) => {
                    if (!err) {
                        logger.log("result from WE Rolename query is : " + data.length);

                        var search_we_rolename_result = data;

                        db.query(job.searchSkill(keyword_search_param), (err, data) => {
                            if (!err) {
                                logger.log("result from skill query is : " + data.length);

                                var search_skill_result = data;

                                db.query(job.searchCompany(keyword_search_param), (err, data) => {
                                    if (!err) {
                                        logger.log("result from company query is : " + data.length);

                                        var search_company_name_result = data;

                                        db.query(job.searchEducationName(keyword_search_param), (err, data) => {
                                            if (!err) {
                                                logger.log("result from education name query is : " + data.length);

                                                var search_education_name_result = data;

                                                db.query(job.searchState(location_search_param), (err, data) => {
                                                    if (!err) {
                                                        logger.log("result from state query is : " + data.length);

                                                        var search_state_result = data;

                                                        db.query(job.searchCountry(location_search_param), (err, data) => {
                                                            if (!err) {
                                                                logger.log("result from country query is : " + data.length);

                                                                var search_company_result = data;

                                                                db.query(job.searchQualification(education_level_search_param), (err, data) => {
                                                                    if (!err) {
                                                                        logger.log("result from qualification query is : " + data.length);

                                                                        var search_qualification_result = data;


                                                                        var all_search_result = [...search_tagline_result, ...search_we_rolename_result,
                                                                            ...search_skill_result, ...search_company_name_result, ...search_education_name_result,
                                                                            ...search_state_result, ...search_company_result, ...search_qualification_result
                                                                        ];

                                                                        logger.log('$$$$$$ all_search_result $$$$$')
                                                                        logger.log(all_search_result.length)

                                                                        var sorted_result = helpers.sortUsersArray(all_search_result);

                                                                        logger.log('$$$$$$ sorted_result $$$$$')
                                                                        logger.log(sorted_result.length)


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


}

function searchJobTitles(job_title_search_param) {
    try {
        var job = new Job();
        db.query(job.searchTagline(job_title_search_param), (err, data) => {
            if (!err) {
                logger.log("result from tagline query is : " + data.length);

                sessionStore.saveTPTaglineSearchResults(data);

                db.query(job.searchWERolename(job_title_search_param), (err, data) => {
                    if (!err) {
                        logger.log("result from WE Rolename query is : " + data.length);

                        sessionStore.saveTPWERolenameSearchResults(data);
                    }
                    sessionStore.collateJobTitleSearchResults();
                });
            }
        });

        return;
    } catch (error) {
        logger.log(error);
    }
}

function searchKeyword(keyword_search_param) {
    try {
        var job = new Job();
        db.query(job.searchSkill(keyword_search_param), (err, data) => {
            if (!err) {
                logger.log("result from skill query is : " + data.length);

                sessionStore.saveTPSkillSearchResults(data);

                db.query(job.searchCompany(keyword_search_param), (err, data) => {
                    if (!err) {
                        logger.log("result from company query is : " + data.length);

                        sessionStore.saveTPCompanySearchResults(data);

                        db.query(job.searchEducationName(keyword_search_param), (err, data) => {
                            if (!err) {
                                logger.log("result from education name query is : " + data.length);

                                sessionStore.saveTPEduNameSearchResults(data);
                            }

                            sessionStore.collateKeywordSearchResults();
                        });
                    }
                });
            }
        });

        //sessionStore.getAllKeywordSearchResults();

        return;
    } catch (error) {
        logger.log(error);
    }

}

function searchLocations(location_search_param) {
    try {
        var job = new Job();
        db.query(job.searchState(location_search_param), (err, data) => {
            if (!err) {
                logger.log("result from state query is : " + data.length);

                sessionStore.saveTPStateSearchResults(data);

                db.query(job.searchCountry(location_search_param), (err, data) => {
                    if (!err) {
                        logger.log("result from country query is : " + data.length);

                        sessionStore.saveTPCountrySearchResults(data);
                    }
                    sessionStore.collateLocationSearchResults();
                });
            }
        });

        //sessionStore.getAllLocationSearchResults(); 

        return;
    } catch (error) {
        logger.log(error);
    }
}

function searchEducationLevel(education_level_search_param) {
    try {
        var job = new Job();
        db.query(job.searchQualification(education_level_search_param), (err, data) => {
            if (!err) {
                logger.log("result from qualification query is : " + data.length);

                sessionStore.saveTPEducationLevelSearchResults(data);
            }

        });

        //sessionStore.getTPEducationLevelSearchResults(); 

        return;
    } catch (error) {
        logger.log(error);
    }
}

router.get('/interviews', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        var redirectFrom = req.query.f;
        var response = req.query.r;

        if (typeof redirectFrom != 'undefined' && redirectFrom) {
            //If redirect is from Update User Profile
            if (redirectFrom == 'a_i') {
                res.render('recruiter_interviews', {
                    view: 'interviews',
                    data: userData,
                    showAlert: true,
                    alertMessage: response == 's' ? 'Interview Created Successfully' : 'An error occured. Please try again',
                    alertType: response == 's' ? 'success' : 'error'
                });
            }
        } else {
            res.render('recruiter_interviews', {
                view: 'interviews',
                data: userData
            });
        }
    } catch (error) {
        logger.log(error);
    }
});

router.get('/interviews/interview-detail/:interviewId', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var interviewId = req.params.interviewId;
        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        var user = new User();
        db.query(user.getInterviewByInterviewId(interviewId), (err, data) => {
            if (!err) {
                var interview_data = data[0];

                interview_data.date_time_ago = helpers.getCurrentTimeAgo(interview_data.date_created);
                interview_data.date = helpers.formatDateTime(interview_data.date_created);

                res.render('recruiter_interview_detail', {
                    view: 'interviews',
                    data: userData,
                    interview_data: interview_data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get('/create-interview', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        res.render('recruiter_create_interview', {
            view: 'interviews',
            data: userData
        });
    } catch (error) {
        logger.log(error);
    }

});

router.get('/edit-interview/:interviewId', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var interviewId = req.params.interviewId;
        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        var user = new User();
        db.query(user.getInterviewByInterviewId(interviewId), (err, data) => {
            if (!err) {
                var interviewData = data[0];

                logger.log(interviewId)

                res.render('recruiter_edit_interview', {
                    view: 'interviews',
                    data: userData,
                    interviewData: interviewData
                });
            }
        });
    } catch (error) {
        loffer.log(error);
    }

});

router.post('/delete-interview', (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var interview_id = req.body.interview_id;

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        var user = new User();
        db.query(user.getInterviewByInterviewId(interview_id), (err, data) => {
            if (err) { logger.log(err); } else {
                var interview_name = data[0].interview_name;

                db.query(user.deleteInterviewByInterviewId(interview_id), (err, data) => {
                    if (!err) {
                        if (data && data.affectedRows > 0) {

                            helpers.saveActivityTrail(user_id, "Interview Deleted",
                                "You deleted an interview titled (" + interview_name + ").");

                            res.status(200).json({
                                message: 'Interview deleted.',
                                affectedRows: data.affectedRows
                            });
                        } else {
                            res.status(200).json({
                                message: "Interview Not found."
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

router.get('/get-all-recruiters-interviews', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        var user = new User();
        db.query(user.getAllRecruitersInterviews(user_id), (err, data) => {
            if (!err) {
                for (var i = 0; i < data.length; i++) {
                    data[i].formatted_date = helpers.formatDateTime(data[i].date_created);
                    data[i].interview_date = helpers.formatDateTime(data[i].interview_date);
                }
                res.status(200).json({
                    message: "All Interviews.",
                    interviews: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post('/get-all-candidates-for-interview', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var interview_id = req.body.interview_id;
        var job_id = req.body.job_id;

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        var user = new User();
        db.query(user.getAllCandidatesForInterview(interview_id, job_id), (err, data) => {
            if (!err) {
                for (var i = 0; i < data.length; i++) {
                    data[i].date_time_ago = helpers.getCurrentTimeAgo(data[i].date_created);
                    data[i].application_date = helpers.formatDateTime(data[i].application_date);
                    data[i].photo_url = data[i].photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);
                }
                res.status(200).json({
                    message: "All Candidates.",
                    candidates: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post("/add-interview", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var interview_name = req.body.interview_name;
        var interview_date = req.body.interview_date;
        var interview_time = req.body.interview_time;
        var venue = req.body.venue;
        var link_to_virtual_meeting = req.body.link_to_virtual_meeting;
        var dress_code = req.body.dress_code;
        var job_assigned_to = req.body.job_assigned_to;
        var interview_description = req.body.interview_description;

        var userData = req.session.passport.user;
        var user_id = userData.user_id;
        var recipient_email = userData.email;
        var recipient_full_name = userData.first_name;

        var user = new User();
        db.query(user.createInterview(interview_name, interview_date, interview_time, venue, link_to_virtual_meeting,
            dress_code, job_assigned_to, interview_description, user_id), (err, data) => {
            if (err) { logger.log(err) } else {
                if (data) {
                    var interview_id = data.insertId;

                    helpers.saveActivityTrail(user_id, "Interview Created",
                        "You set an interview (" + interview_name + ") for " + interview_date + " by " + interview_time + ".");

                    mailer.sendCreateInterviewMail(req, recipient_full_name, recipient_email, interview_id,
                        interview_name, interview_date, interview_time);

                    sendInterviewMailToCandidates(job_assigned_to, interview_name, interview_date, interview_time, venue, link_to_virtual_meeting);

                    res.redirect('/recruiters/interviews?f=a_i&r=s');
                } else {
                    res.redirect('/recruiters/interviews?f=a_i&r=e');
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post("/update-interview", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var interview_id = req.body.interview_id;
        var interview_name = req.body.interview_name;
        var interview_date = req.body.interview_date;
        var interview_time = req.body.interview_time;
        var venue = req.body.venue;
        var link_to_virtual_meeting = req.body.link_to_virtual_meeting;
        var dress_code = req.body.dress_code;
        var job_assigned_to = req.body.job_assigned_to;
        var interview_description = req.body.interview_description;

        var userData = req.session.passport.user;
        var user_id = userData.user_id;
        var recipient_email = userData.email;
        var recipient_full_name = userData.first_name;

        var user = new User();
        db.query(user.updateInterview(interview_id, interview_name, interview_date, interview_time, venue,
            link_to_virtual_meeting, dress_code, job_assigned_to, interview_description, user_id), (err, data) => {

            if (err) { logger.log(err) } else {
                if (data) {
                    var interview_id = data.insertId;

                    helpers.saveActivityTrail(user_id, "Interview Updated", "You updated the interview (" + interview_name + ")");

                    mailer.sendUpdateInterviewMail(req, recipient_full_name, recipient_email, interview_id,
                        interview_name, interview_date, interview_time);

                    sendInterviewMailToCandidates(job_assigned_to, interview_name, interview_date, interview_time, venue, link_to_virtual_meeting);

                    res.redirect('/recruiters/interviews?f=a_i&r=s');
                } else {
                    res.redirect('/recruiters/interviews?f=a_i&r=e');
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

function sendInterviewMailToCandidates(job_id, interview_name, interview_date, interview_time, venue, link_to_virtual_meeting) {
    try {
        logger.log("Sending Interview Mail to Candidates")

        db.query(Job.getJobNameByIdQuery(job_id), (err, data) => {
            if (err) { logger.log(err) } else {
                var job_name = data[0].job_name;

                db.query(Job.getAllShortlistedJobApplicants(job_id), (err, data) => {
                    if (err) { logger.log(err) } else {
                        var shortlisted_applicants = data;

                        for (var i = 0; i < shortlisted_applicants.length; i++) {
                            var applicant_id = shortlisted_applicants[i].user_id;
                            var applicant_full_name = shortlisted_applicants[i].first_name + ' ' + shortlisted_applicants[i].last_name;
                            var applicant_email = shortlisted_applicants[i].email;

                            logger.log("Sending Interview Mail to id: " + applicant_id)

                            if (venue == "Physical") {
                                logger.log('Sending Physical Interview mail to candiate: ' + applicant_id);
                                mailer.sendPhysicalInterviewMailToCandidate(applicant_full_name, applicant_email,
                                    job_name, interview_name, interview_date, interview_time, venue);
                            } else {
                                logger.log('Sending Virtual Interview mail to candiate: ' + applicant_id);
                                mailer.sendVirtualInterviewMailToCandidate(applicant_full_name, applicant_email, job_name, interview_name, interview_date,
                                    interview_time, venue, link_to_virtual_meeting);
                            }
                        }
                    }
                });
            }
        });

    } catch (error) {
        logger.log(error);
    }
}

router.get('/created-jobs', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        res.render('recruiter_created_jobs', {
            view: 'created-jobs',
            data: userData
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get('/application-info/:jobId', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var job_id = req.params.jobId;
        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        db.query(Job.getJobByIdQuery(job_id), (err, data) => {
            if (!err) {
                var jobData = data[0];

                res.render('recruiter_job_applicants_info', {
                    view: 'created-jobs',
                    data: userData,
                    jobData: jobData
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get('/all-job-candidates/:jobId', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var job_id = req.params.jobId;
        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        db.query(Job.getJobNameByIdQuery(job_id), (err, data) => {
            if (!err) {
                var job_name = data[0].job_name;

                res.render('recruiter_all_job_candidates', {
                    view: 'created-jobs',
                    data: userData,
                    job_id: job_id,
                    job_name: job_name
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.get('/all-rejected-candidates/:jobId', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var job_id = req.params.jobId;
        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        db.query(Job.getJobNameByIdQuery(job_id), (err, data) => {
            if (!err) {
                var job_name = data[0].job_name;

                res.render('recruiter_all_rejected_candidates', {
                    view: 'created-jobs',
                    data: userData,
                    job_id: job_id,
                    job_name: job_name
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.get('/candidate-info/:userId', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        var user_id = req.params.userId;
        var job_id = req.query.l;

        job_id = typeof job_id != 'undefined' ? job_id : 0;

        //Get all user info initially
        db.query(User.getUserByIdQuery(user_id), (err, data) => {
            if (err) { logger.log(err) } else {
                var userInfo = data[0];

                userInfo.photo_url = userInfo.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

                //Get Resume Info
                db.query(Resume.getResumeByUserIdQuery(user_id), (err, data) => {
                    if (err) { logger.log(err) } else {
                        var resumeInfo = data[0];
                        var resume_id = resumeInfo.resume_id;

                        //Get all Candidate Educations
                        db.query(Resume.getAllEducationByResumeIdQuery(resume_id), (err, data) => {
                            if (err) { logger.log(err) } else {
                                var educationData = data;

                                //Get all Candidate WEs
                                db.query(Resume.getAllWorkExperienceByResumeIdQuery(resume_id), (err, data) => {
                                    if (err) { logger.log(err) } else {
                                        var workExperienceData = data;

                                        //Get all Candidate Certifications
                                        db.query(Resume.getAllCertificationByResumeIdQuery(resume_id), (err, data) => {
                                            if (err) { logger.log(err) } else {
                                                var certificationData = data;

                                                //Get all Candidate Certifications
                                                db.query(Resume.getAllSkillByResumeIdQuery(resume_id), (err, data) => {
                                                    if (err) { logger.log(err) } else {
                                                        var skillData = data;

                                                        //Get all Candidate Specializations
                                                        db.query(Resume.getAllSpecializationByResumeIdQuery(resume_id), (err, data) => {
                                                            if (err) { logger.log(err) } else {
                                                                var specializationData = data;

                                                                //Get Candidate Application Status
                                                                db.query(Job.getCandidateApplicationStatus(user_id, job_id), (err, data) => {
                                                                    if (err) { logger.log(err) } else {
                                                                        var applicationData = data[0];

                                                                        var response = req.query.r;

                                                                        if (typeof response != 'undefined' && response) {
                                                                            res.render('recruiter_candidate_info', {
                                                                                view: 'created-jobs',
                                                                                data: userData,
                                                                                userInfo: userInfo,
                                                                                resumeInfo: resumeInfo,
                                                                                educationData: educationData,
                                                                                workExperienceData: workExperienceData,
                                                                                certificationData: certificationData,
                                                                                specializationData: specializationData,
                                                                                skillData: skillData,
                                                                                applicationData: applicationData,
                                                                                job_id: job_id,
                                                                                showAlert: true,
                                                                                alertMessage: response == 's' ? 'Candidate status changed' : 'Candidate Status not changed',
                                                                                alertType: response == 's' ? 'success' : 'error'
                                                                            });
                                                                        } else {
                                                                            res.render('recruiter_candidate_info', {
                                                                                view: 'created-jobs',
                                                                                data: userData,
                                                                                userInfo: userInfo,
                                                                                resumeInfo: resumeInfo,
                                                                                educationData: educationData,
                                                                                workExperienceData: workExperienceData,
                                                                                certificationData: certificationData,
                                                                                specializationData: specializationData,
                                                                                skillData: skillData,
                                                                                applicationData: applicationData,
                                                                                job_id: job_id
                                                                            });
                                                                        }
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
                })
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.get('/saved-candidate-info/:userId', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        var user_id = req.params.userId;
        var job_id = req.query.l;

        job_id = typeof job_id != 'undefined' ? job_id : 0;

        //Get all user info initially
        db.query(User.getUserByIdQuery(user_id), (err, data) => {
            if (err) { logger.log(err) } else {
                var userInfo = data[0];

                userInfo.photo_url = userInfo.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

                //Get Resume Info
                db.query(Resume.getResumeByUserIdQuery(user_id), (err, data) => {
                    if (err) { logger.log(err) } else {
                        var resumeInfo = data[0];
                        var resume_id = resumeInfo.resume_id;

                        //Get all Candidate Educations
                        db.query(Resume.getAllEducationByResumeIdQuery(resume_id), (err, data) => {
                            if (err) { logger.log(err) } else {
                                var educationData = data;

                                //Get all Candidate WEs
                                db.query(Resume.getAllWorkExperienceByResumeIdQuery(resume_id), (err, data) => {
                                    if (err) { logger.log(err) } else {
                                        var workExperienceData = data;

                                        //Get all Candidate Certifications
                                        db.query(Resume.getAllCertificationByResumeIdQuery(resume_id), (err, data) => {
                                            if (err) { logger.log(err) } else {
                                                var certificationData = data;

                                                //Get all Candidate Certifications
                                                db.query(Resume.getAllSkillByResumeIdQuery(resume_id), (err, data) => {
                                                    if (err) { logger.log(err) } else {
                                                        var skillData = data;

                                                        //Get all Candidate Specializations
                                                        db.query(Resume.getAllSpecializationByResumeIdQuery(resume_id), (err, data) => {
                                                            if (err) { logger.log(err) } else {
                                                                var specializationData = data;

                                                                var response = req.query.r;

                                                                if (typeof response != 'undefined' && response) {
                                                                    res.render('recruiter_saved_candidate_info', {
                                                                        view: 'saved-candidates',
                                                                        data: userData,
                                                                        userInfo: userInfo,
                                                                        resumeInfo: resumeInfo,
                                                                        educationData: educationData,
                                                                        workExperienceData: workExperienceData,
                                                                        certificationData: certificationData,
                                                                        specializationData: specializationData,
                                                                        skillData: skillData,
                                                                        job_id: job_id,
                                                                        showAlert: true,
                                                                        alertMessage: response == 's' ? 'Candidate status changed' : 'Candidate Status not changed',
                                                                        alertType: response == 's' ? 'success' : 'error'
                                                                    });
                                                                } else {
                                                                    res.render('recruiter_saved_candidate_info', {
                                                                        view: 'saved_candidates',
                                                                        data: userData,
                                                                        userInfo: userInfo,
                                                                        resumeInfo: resumeInfo,
                                                                        educationData: educationData,
                                                                        workExperienceData: workExperienceData,
                                                                        certificationData: certificationData,
                                                                        specializationData: specializationData,
                                                                        skillData: skillData,
                                                                        job_id: job_id
                                                                    });
                                                                }
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
                })
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post("/save-applicant-status", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var application_status = req.body.application_status;
        var personal_message = req.body.personal_message;
        var candidate_id = req.body.candidate_id;
        var job_id = req.body.job_id;

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        db.query(Job.setApplicationStatus(application_status, personal_message, candidate_id, job_id), (err, data) => {
            if (err) { logger.log(err) } else {
                //helpers.saveActivityTrail(user_id, "Applicant Status Changed", "You saved a Job post with job_id - " + job_id);

                res.status(200).json({
                    message: "Applicant Status saved",
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.get('/post-a-job', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        var redirectFrom = req.query.f;
        var response = req.query.r;

        if (typeof redirectFrom != 'undefined' && redirectFrom) {
            if (redirectFrom == 'p_j') {
                res.render('recruiter_post_a_job', {
                    view: 'post-a-job',
                    data: userData,
                    showAlert: true,
                    alertMessage: response == 's' ? 'Job Posted Successfully' : 'An error occured. Please try again',
                    alertType: response == 's' ? 'success' : 'error'
                });
            }

        } else {
            res.render('recruiter_post_a_job', {
                view: 'post-a-job',
                data: userData
            });
        }
    } catch (error) {
        logger.log(error);
    }
});

router.get('/assessments', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        var redirectFrom = req.query.f;
        var response = req.query.r;

        if (typeof redirectFrom != 'undefined' && redirectFrom) {
            if (redirectFrom == 'c_a') {
                res.render('recruiter_assessments', {
                    view: 'assessments',
                    data: userData,
                    showAlert: true,
                    alertMessage: response == 's' ? 'Assessment Created Successfully' : 'An error occured. Please try again',
                    alertType: response == 's' ? 'success' : 'error'
                });
            }
        } else {
            res.render('recruiter_assessments', {
                view: 'assessments',
                data: userData
            });
        }
    } catch (error) {
        logger.log(error);
    }

});

router.get('/create-assessment', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        res.render('recruiter_create_assessment', {
            view: 'assessments',
            data: userData
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get("/get-recruiter-activity-history", (req, res, next) => {
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

router.get("/get-recruiter-statistics", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        var user = new User();
        db.query(user.getCountOfJobOpenings(user_id), (err, data) => {
            if (err) { logger.log(err) } else {
                var recruiterJobOpeningsCount = data[0].count;

                db.query(user.getCountOfTotalQualifiedCandidates(user_id), (err, data) => {
                    if (err) { logger.log(err) } else {
                        var recruiterTotalQualifiedCandidatesCount = data[0].count;

                        db.query(user.getCountOfRecruiterSavedCandidates(user_id), (err, data) => {
                            if (err) { logger.log(err) } else {
                                var recruiterSavedCandidates = data[0].count;

                                var assessment = new Assessment()
                                db.query(assessment.getCountOfRecruiterAssessmentsCreated(user_id), (err, data) => {
                                    if (err) { logger.log(err) } else {
                                        var recruiterAssessmentCreated = data[0].count;

                                        res.status(200).json({
                                            message: "Recruiter Statistics.",
                                            jobOpeningsCount: recruiterJobOpeningsCount,
                                            totalQualifiedCandidatesCount: recruiterTotalQualifiedCandidatesCount,
                                            savedCandidatesCount: recruiterSavedCandidates,
                                            assessmentsCreatedCount: recruiterAssessmentCreated
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

router.post("/add", (req, res, next) => {
    try {
        var captcha_response = req.body['g-recaptcha-response'];
        console.log('captcha_response - ' + captcha_response)

        addRecruiterProcess(req, res);

        /* if (captcha_response === undefined || captcha_response === '' || captcha_response === null) {
             res.redirect('/register?v=c_f')
         } else {
             var verificationUrl = config.captcha_verification_url_prefix + config.captcha_secret_key + "&response=" + captcha_response + "&remoteip=" + req.connection.remoteAddress;

             request(verificationUrl, function(error, response, body) {
                 body = JSON.parse(body);

                 if (body.success !== undefined && !body.success) {
                     res.redirect('/register?v=c_f')
                 } else {
                     
                 }
             });
         } */

    } catch (error) {
        logger.log(error);
    }
});

function addRecruiterProcess(req, res) {
    try {
        'use strict';

        var form = new formidable.IncomingForm();

        form.parse(req, function(err, fields, files) {
            if (err) { logger.log(err) } else {

                var azureHelper = new AzureHelper();
                azureHelper.uploadRecruiterKYCDocsToAzure(files);

                var means_of_id_url = '';
                var certificate_of_incorp_url = '';

                if (files.means_of_identification.name != '') {
                    means_of_id_url = config.azure_recruiter_kyc_files_url + files.means_of_identification.name;
                }

                if (files.cert_of_incorporation.name != '') {
                    certificate_of_incorp_url = config.azure_recruiter_kyc_files_url + files.cert_of_incorporation.name;
                }

                console.log('means_of_id_url - ' + means_of_id_url)
                console.log('certificate_of_incorp_url - ' + certificate_of_incorp_url)

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
                var recruiter_class = fields.recruiter_class;

                var username = '';
                var other_name = '';
                var gender = '';
                var dob = '';
                var profile_completeness = '';
                var tagline = '';

                var state = 0;
                var country = 0;
                var highest_qualification = 0;
                var industry = 0;
                var years_of_experience = '';

                var plan_type = config.classic_plan;

                db.query(User.checkIfEmailExist(email), (err, data) => {
                    if (!err) {
                        if (data && data.length > 0) {

                            res.redirect('/register?v=f');
                        } else {
                            var is_activated = config.not_activated;

                            console.log('recruiter_class - ' + recruiter_class)

                            db.query(user.createUserQuery(user_uuid, first_name, last_name, username, other_name, email, phone_number, gender,
                                dob, profile_completeness, photo_url, social_media_id, tagline, password, is_activated,
                                means_of_id_url, recruiter_class, plan_type, state, country, highest_qualification, industry, years_of_experience), (err, data) => {
                                if (!err) {
                                    if (data) {
                                        var user_id = data.insertId;

                                        var company_name = fields.company_name;
                                        var industry = fields.industry;
                                        var rc_number = fields.rc_number;
                                        var no_of_employees = fields.no_of_employees;
                                        var year_established = fields.year_established;
                                        var type_of_employer = fields.type_of_employer;
                                        var facebook_link = fields.facebook_link;
                                        var twitter_link = fields.twitter_link;
                                        var instagram_link = fields.instagram_link;
                                        var google_plus_link = fields.google_plus_link;
                                        var linkedin_link = fields.linkedin_link;
                                        var youtube_channel_link = fields.youtube_channel_link;
                                        var company_phone_number = fields.phone_number;
                                        var company_email = fields.company_email;
                                        var website = fields.website;
                                        var country = fields.country;
                                        var address = fields.address;
                                        var state = fields.state;
                                        var company_logo = fields.company_logo;
                                        var company_banner_img_url = fields.company_banner_img_url;


                                        db.query(user.createCompanyQuery(company_name, industry, no_of_employees, year_established,
                                            type_of_employer, rc_number, facebook_link, instagram_link, twitter_link, google_plus_link,
                                            youtube_channel_link, linkedin_link, website, address, country, state, company_phone_number,
                                            company_email, company_logo, company_banner_img_url, certificate_of_incorp_url,
                                            user_id), (err, data) => {

                                            var company_id = data.insertId;

                                            if (!err) {

                                                db.query(User.addCompanyToRecruiter(user_id, company_id), (err, data) => {
                                                    if (!err) {
                                                        db.query(User.insertUserRole(user_id, config.recruiter_admin_role_tag), (err, data) => {
                                                            if (!err) {
                                                                helpers.saveActivityTrail(user_id, "Register", "Registration Completed.");

                                                                // send welcome mail
                                                                var fullname = first_name + ' ' + last_name;
                                                                mailer.sendRecruiterWelcomeMail(fullname, email);

                                                                // Redirect to login authentication to load session
                                                                var redirect_link = '/auth/login?username=' + email + '&password=' + password;
                                                                res.redirect(redirect_link);
                                                            }
                                                        })
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        }
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
}

router.post("/add-teammates", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var newTeammatesemails = JSON.parse(req.body.emails);

        for (var i = 0; i < newTeammatesemails.length; i++) {
            addTeammate(req, res, newTeammatesemails[i]);
        }
    } catch (error) {
        logger.log(error);
    }
});

function addTeammate(req, res, email) {
    try {
        var user_uuid = uuidv1();
        var first_name = '';
        var last_name = '';
        var phone_number = '';
        var photo_url = '';
        var social_media_id = '';
        var password = '';
        var username = '';
        var other_name = '';
        var gender = '';
        var dob = '';
        var profile_completeness = '';
        var tagline = '';

        db.query(User.checkIfEmailExist(email), (err, data) => {
            if (!err) {
                if (data && data.length > 0) {
                    res.status(200).json({
                        result: false
                    });

                } else {
                    var is_activated = config.not_activated;

                    var userData = req.session.passport.user;
                    var recruiter_full_name = recruiterData.full_name;
                    var recruiter_email = recruiterData.email;
                    var company_id = recruiterData.company_id;
                    var company_name = recruiterData.company_name;

                    var user = new User();
                    db.query(user.createTeammateQuery(user_uuid, first_name, last_name, username, other_name, email, phone_number, gender,
                        dob, profile_completeness, photo_url, social_media_id, tagline, password, is_activated,
                        company_id), (err, data) => {

                        if (!err) {
                            if (data) {
                                var user_id = data.insertId;

                                if (!err) {
                                    db.query(User.insertUserRole(user_id, config.recruiter_role_tag), (err, data) => {
                                        if (!err) {
                                            helpers.saveActivityTrail(user_id, "Teammate Invited",
                                                "You were invited by " + recruiter_full_name + " (" + recruiter_email + ") to the team");

                                            //Send Invite Mail
                                            mailer.sendTeamInviteMail(req, email, recruiter_full_name, company_name, "Recruiter");

                                            res.status(200).json({
                                                result: true
                                            });
                                        }
                                    });
                                }
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

router.get("/create-password", (req, res, next) => {
    try {
        var user_id = req.query.userId;

        res.render('recruiter_create_password', { user_id: user_id });
    } catch (error) {
        loffer.log(error);
    }
});

router.get("/get-all-company-teammates", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var company_id = userData.company;

        db.query(User.getAllCompanyTeamMembersByCompanyId(company_id), (err, data) => {
            if (!err) {
                res.status(200).json({
                    message: "All Team Members.",
                    teammates: data
                });
            }
        });
    } catch (error) {
        loffer.log(error);
    }
});

router.post("/update", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        if (req.body.current_password) {
            changePassword(req, res, user_id, userData);
        } else if (req.body.company_name) {
            updateCompanyProfile(req, res, user_id, userData);
        } else {
            updatePersonalProfile(req, res, user_id, userData);
        }
    } catch (error) {
        loffer.log(error);
    }

});

router.post("/create-password-for-invited-user", (req, res, next) => {
    try {
        var user_id = req.body.user_id;
        var first_name = req.body.first_name;
        var last_name = req.body.last_name;
        var password = req.body.password;

        db.query(User.updateInvitedUserInfo(user_id, first_name, last_name, password), (err, data) => {
            if (!err) {
                if (data && data.affectedRows > 0) {

                    helpers.saveActivityTrail(user_id, "Password Created", "Password has been created successfully.");

                    res.redirect('/login?f=u_iu&r=s');

                } else {
                    res.redirect('/recruiters/create-password?userId=' + user_id);
                }
            }
        });
    } catch (error) {
        loffer.log(error);
    }
});

function updatePersonalProfile(req, res, user_id, userData) {
    try {
        var first_name = req.body.first_name;
        var last_name = req.body.last_name;
        var email = req.body.email;
        var phone_number = req.body.phone_number;

        var user = new User();

        db.query(user.updateRecruiterQuery(user_id, first_name, last_name, email, phone_number), (err, data) => {
            if (!err) {
                if (data && data.affectedRows > 0) {

                    helpers.saveActivityTrail(user_id, "Profile Updated", "You updated your profile.");

                    //Saving back to session
                    req.session.passport.user = {
                        user_id: userData.user_id,
                        user_uuid: userData.user_uuid,
                        first_name: first_name,
                        last_name: last_name,
                        username: userData.username,
                        other_name: userData.other_name,
                        email: email,
                        phone_number: phone_number,
                        address: userData.address,
                        state: userData.state,
                        country: userData.country,
                        gender: userData.gender,
                        dob: userData.dob,
                        profile_completeness: userData.profile_completeness,
                        photo_url: userData.photo_url,
                        social_media_id: userData.social_media_id,
                        company: userData.company,
                        tagline: userData.tagline,
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
                        company_id: userData.company_id,
                        company_name: userData.company_name,
                        plan_type: userData.plan_type
                    }

                    res.redirect('/recruiters/settings?r=s&f=u_p');

                } else {
                    res.redirect('/recruiters/settings?r=f');
                }
            }
        });
    } catch (error) {
        loffer.log(error);
    }

}

function updateCompanyProfile(req, res, user_id, userData) {
    try {
        var company_id = userData.company_id;
        var company_name = req.body.company_name;
        var rc_number = req.body.rc_number;
        var industry = req.body.industry;
        var no_of_employees = req.body.no_of_employees;
        var year_established = req.body.year_established;
        var type_of_employer = req.body.type_of_employer;
        var facebook_link = req.body.facebook_link;
        var instagram_link = req.body.instagram_link;
        var twitter_link = req.body.twitter_link;
        var google_plus_link = req.body.google_plus_link;
        var linkedin_link = req.body.linkedin_link;
        var youtube_channel_link = req.body.youtube_channel_link;
        var company_phone_number = req.body.company_phone_number;
        var company_email = req.body.company_email;
        var company_website = req.body.company_website;
        var country = req.body.country;
        var address = req.body.address;
        var city = req.body.city;
        var state = req.body.state;
        var company_logo_url = req.body.company_logo_url;
        var company_banner_img_url = req.body.company_banner_img_url;
        var company_description = req.body.company_description;

        var user = new User();

        db.query(user.updateRecruiterCompany(company_id, company_name, rc_number, industry, no_of_employees,
            year_established, type_of_employer, facebook_link, instagram_link, twitter_link, google_plus_link,
            linkedin_link, youtube_channel_link, company_phone_number, company_email, company_website, country,
            address, city, state, company_logo_url, company_banner_img_url, company_description), (err, data) => {

            if (!err) {
                if (data && data.affectedRows > 0) {

                    helpers.saveActivityTrail(user_id, "Company Profile Updated", "Company Profile has been updated.");


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
                        photo_url: userData.photo_url,
                        social_media_id: userData.social_media_id,
                        company: userData.company,
                        tagline: userData.tagline,
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
                        company_id: userData.company_id,
                        company_name: company_name,
                        plan_type: userData.plan_type
                    }

                    res.redirect('/recruiters/settings?r=s&f=u_cp');
                }
            }
        });
    } catch (error) {
        loffer.log(error);
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

                res.redirect('/recruiters/settings?f=p&r=i_p');
            } else {
                if (data.length > 0) {
                    if (!bcrypt.compareSync(current_password, data[0].password)) {
                        logger.log("Password does not match")

                        res.redirect('/recruiters/settings?f=p&r=p_m');

                    } else {
                        logger.log("about to update")
                        db.query(User.updatePasswordQuery(user_id, new_password), (err, data) => {
                            if (!err) {
                                if (data && data.affectedRows > 0) {

                                    helpers.saveActivityTrail(user_id, "Password", "Password has been changed successfully.");

                                    res.redirect('/recruiters/settings?f=p&r=p_s');

                                } else {
                                    res.redirect('/recruiters/settings?f=p&r=p_e');
                                }
                            }
                        });
                    }
                }
            }
        });
    } catch (error) {
        loffer.log(error);
    }

}

router.post("/upload-profile-picture", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

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

                        //Saving back to session
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
                            company_id: userData.company_id,
                            company_name: userData.company_name,
                            plan_type: userData.plan_type
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
        loffer.log(error);
    }

});

router.post("/download-resume", (req, res, next) => {
    try {
        var user_id = req.body.candidate_id;

        var user = new User();
        db.query(user.getCandidateCV(user_id), (err, data) => {
            if (err) { logger.log(err) } else {
                var candidate_resume_url =
                    typeof data[0].resume_file_url != 'undefined' && data[0].resume_file_url &&
                    data[0].resume_file_url != '' && data[0].resume_file_url != null ?
                    data[0].resume_file_url : 'false';

                if (candidate_resume_url != 'false') {
                    helpers.downloadResumeFromAzure(res, candidate_resume_url);

                } else {
                    res.status(200).json({
                        message: 'CV/Resume not Downloaded',
                        isDownloaded: false
                    });
                }
            }
        });
    } catch (error) {
        loffer.log(error);
    }
});

router.post("/download-resume-talent-pool", (req, res, next) => {
    try {
        var userData = req.session.passport.user;
        var recruiter_id = userData.user_id;

        var candidate_id = req.body.candidate_id;

        var user = new User();
        db.query(user.getCandidateCV(candidate_id), (err, data) => {
            if (err) { logger.log(err) } else {
                var candidate_resume_url = typeof data[0].resume_file_url != 'undefined' && data[0].resume_file_url &&
                    data[0].resume_file_url != '' && data[0].resume_file_url != null ?
                    data[0].resume_file_url : 'false';

                if (candidate_resume_url != 'false') {
                    logger.log("Downloading File from Azure");

                    var azureHelper = new AzureHelper();
                    var promiseResult = azureHelper.downloadFromBlob(res, candidate_resume_url);

                    promiseResult
                        .then(response => {
                            logger.log("File downloaded successfully. Saving resume");
                            db.query(Resume.getResumeIdByUserId(candidate_id), (err, data) => {
                                if (err) { logger.log(err); } else {
                                    var resume_id = data[0].resume_id;

                                    db.query(user.saveCandidate(resume_id, candidate_id, recruiter_id), (err, data) => {
                                        if (err) { logger.log(err); } else { logger.log("Resume Saved Successfully"); }
                                    });
                                }
                            });
                        })
                        .catch(error => {
                            res.status(200).json({
                                message: 'CV/Resume not Downloaded',
                                isDownloaded: false
                            });
                        })

                } else {
                    res.status(200).json({
                        message: 'CV/Resume not Downloaded',
                        isDownloaded: false
                    });
                }
            }
        });
    } catch (error) {
        loffer.log(error);
    }
});

router.post("/remove-saved-candidate", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var saved_resume_id = req.body.saved_resume_id;

        var userData = req.session.passport.user;
        var recruiter_user_id = userData.user_id;

        var user = new User();
        db.query(user.removeSavedCandidate(saved_resume_id), (err, data) => {
            if (!err) {
                if (data && data.affectedRows > 0) {

                    helpers.saveActivityTrail(recruiter_user_id, "Candidate Removed",
                        "You removed a candidate from your saved resumes");

                    res.status(200).json({
                        message: 'Candidate Removed.',
                        affectedRows: data.affectedRows
                    });
                } else {
                    res.status(200).json({
                        message: "Candidate Not found."
                    });
                }
            }
        });
    } catch (error) {
        loffer.log(error);
    }

});

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
        loffer.log(error);
    }
});

router.post("/download-excel-file", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var job_id = req.body.job_id;
        var job_name = req.body.job_name;
        var excel_file_to_download = req.body.excel_file_to_download;

        if (excel_file_to_download == 'all') {
            db.query(Job.getAllJobApplicantsForExcel(job_id), (err, data) => {
                if (!err) {
                    var applicants_list = data;

                    for (var i = 0; i < applicants_list.length; i++) {
                        applicants_list[i].date_applied = helpers.formatDateTime(applicants_list[i].date_applied);
                    }

                    excel.createAllApplicantsWorkbook(res, job_id, job_name, applicants_list);
                }
            });
        } else if (excel_file_to_download == 'shortlist') {
            db.query(Job.getAllShortlistedJobApplicantsForExcel(job_id), (err, data) => {
                if (!err) {
                    var applicants_list = data;

                    for (var i = 0; i < applicants_list.length; i++) {
                        applicants_list[i].date_applied = helpers.formatDateTime(applicants_list[i].date_applied);
                    }

                    excel.createAllShortlistedApplicantsWorkbook(res, job_id, job_name, applicants_list);
                }
            });
        } else if (excel_file_to_download == 'non_shortlist') {
            db.query(Job.getAllRejectedJobApplicants(job_id), (err, data) => {
                if (!err) {
                    var applicants_list = data;

                    for (var i = 0; i < applicants_list.length; i++) {
                        applicants_list[i].date_applied = helpers.formatDateTime(applicants_list[i].date_applied);
                    }

                    excel.createAllNonShortlistedApplicantsWorkbook(res, job_id, job_name, applicants_list);
                }
            });
        }
    } catch (error) {
        loffer.log(error);
    }

});

router.get('/job-detail/:jobId', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var jobId = req.params.jobId;
        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        db.query(Job.getJobByIdQueryRecruiter(jobId), (err, data) => {
            if (!err) {
                var jobData = data[0];

                jobData.job_description = jobData.job_description.substring(0, jobData.job_description.length - 1);
                //jobData.job_responsibilities = jobData.job_responsibilities.substring(0, jobData.job_responsibilities.length - 1)

                //jobData.job_description = jobData.job_description + "<br><br><h6>Job Responsibilities</h6><br>" + jobData.job_responsibilities

                jobData.job_description = helpers.unescapeHTML(jobData.job_description);

                jobData.company_logo_url = jobData.company_logo_url.replace('/uploads/images/company_logos/', config.azure_company_logo_url);

                res.render('recruiter_job_details', {
                    view: 'created-jobs',
                    data: userData,
                    jobData: jobData
                });
            }
        });
    } catch (error) {
        loffer.log(error);
    }

});

router.get('/edit-job/:jobId', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var jobId = req.params.jobId;
        var userData = req.session.passport.user;

        userData.photo_url = userData.photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

        db.query(Job.getJobByIdQueryRecruiter(jobId), (err, data) => {
            if (!err) {
                var jobData = data[0];

                logger.log(jobData)

                res.render('recruiter_edit_job', {
                    view: 'created-jobs',
                    data: userData,
                    jobData: jobData
                });
            }
        });
    } catch (error) {
        loffer.log(error);
    }

});

module.exports = router;