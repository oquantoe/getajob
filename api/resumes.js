var express = require('express');
var db = require('../db/database');
var Resume = require('../models/resume');
var User = require('../models/user');
var helpers = require('../config/helpers');
var config = require('./../config/config');
var logger = require('./../config/log4js');

var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

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

//CV
router.post('/check-resume', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;

        db.query(Resume.getResumeByUserIdQuery(userData.user_id), (err, data) => {
            if (err) { logger.log(err) } else {
                var resume = data[0];
                var resume_file_url = data[0].resume_file_url;

                logger.log("resume - " + resume_file_url);

                res.status(200).json({
                    resume_file_url: resume_file_url
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post('/add-summary', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;
        var summary = req.body.summary;

        var resume = new Resume();
        db.query(resume.addResumeSummaryQuery(user_id, summary), (err, data) => {
            if (!err) {
                if (data) {
                    //Summary has been updated
                    //Get all resume info again
                    //resume.getAllUserResumeInformation(user_id);

                    helpers.saveActivityTrail(user_id, "Summary added", "You edited the summary in your resume.");

                    res.redirect('/candidates/profile?q=summary&r=s')
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post("/add-resume", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        //read user information from request
        var resume = new Resume(req.body.user_id);

        db.query(resume.createResumeQuery(), (err, data) => {
            if (!err) {
                if (data) {
                    var user_id = data.insertId;

                    res.status(200).json({
                        message: "Resume added.",
                        resumeId: data.insertId
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

// Education
router.post("/all-education", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var resume_id = req.body.resume_id;

        db.query(Resume.getAllEducationByResumeIdQuery(resume_id), (err, data) => {
            if (!err) {
                res.status(200).json({
                    message: "All User's Education listed.",
                    educations: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post("/add-education/:resumeId", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        //read user information from request
        var name_of_institution = req.body.name_of_institution;
        var qualification = req.body.qualification;
        var qualification_grade = req.body.qualification_grade;
        var start_date = req.body.start_date;
        var end_date = req.body.end_date;
        var description = req.body.description;

        var resume_id = req.params.resumeId;

        var resume = new Resume();

        db.query(resume.createEducationQuery(name_of_institution, qualification, qualification_grade, start_date,
            end_date, description), (err, data) => {
            if (!err) {
                if (data) {
                    var education_id = data.insertId;

                    db.query(Resume.insertResumeEducationQuery(resume_id, education_id), (err, data) => {
                        if (!err) {
                            res.status(200).json({
                                message: "Education added with ResumeEducation mapping.",
                                resumeEducationId: data.insertId
                            });
                        }
                    })
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post("/update-education/:educationId", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var education_id = req.params.educationId;

        var name_of_institution = req.body.name_of_institution;
        var qualification = req.body.qualification;
        var qualification_grade = req.body.qualification_grade;
        var start_date = req.body.start_date;
        var end_date = req.body.end_date;
        var description = req.body.description;

        var resume = new Resume();
        db.query(resume.updateEducationQuery(education_id, name_of_institution, qualification, qualification_grade, start_date,
            end_date, description), (err, data) => {
            if (!err) {
                if (data && data.affectedRows > 0) {
                    res.status(200).json({
                        message: `Education updated with id = ${education_id}`,
                        affectedRows: data.affectedRows
                    });
                } else {
                    res.status(200).json({
                        message: "Education Not found."
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post('/save-candidate-education', function(req, res, next) {
    try {
        helpers.checkifAuthenticated(req, res);

        var name_of_institution = helpers.checkifUndefined(req.body.name_of_institution);
        var qualification = helpers.checkifUndefined(req.body.qualification);
        var course_of_study = helpers.checkifUndefined(req.body.course_of_study);
        var start_month = helpers.checkifUndefined(req.body.start_month);
        var start_year = helpers.checkifUndefined(req.body.start_year);
        var end_month = helpers.checkifUndefined(req.body.end_month);
        var end_year = helpers.checkifUndefined(req.body.end_year);
        var currently_attend = helpers.checkifUndefined(req.body.currently_attend);

        var start_date = start_month + ', ' + start_year;
        var end_date = end_month + ', ' + end_year;

        //Getting user resume_id
        var user = req.session.passport.user;

        logger.log(user)

        var resume = new Resume();

        db.query(resume.createEducationQuery(name_of_institution, course_of_study, qualification, start_date,
            end_date, user.user_id), (err, data) => {
            if (!err) {
                if (data) {
                    var education_id = data.insertId;
                    var resume_id = user.resume_id;

                    db.query(Resume.insertResumeEducationQuery(resume_id, education_id), (err, data) => {
                        if (!err) {
                            //Education has been added
                            //Get all resume info again
                            //resume.getAllUserResumeInformation(user.user_id);

                            helpers.saveActivityTrail(user.user_id, "Education added", "You added an education from " + name_of_institution + " to your resume.");

                            res.status(200).json({
                                message: "Education added.",
                                resume_education_id: data.insertId
                            });
                        }
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post('/delete-candidate-education', function(req, res, next) {
    try {
        helpers.checkifAuthenticated(req, res);

        var education_id = req.body.education_id;
        var name_of_institution = req.body.name_of_institution;

        //Getting user resume_id
        var user = req.session.passport.user;

        var resume = new Resume();
        db.query(resume.deleteEducationQuery(education_id), (err, data) => {
            if (!err) {
                if (data) {
                    //Education has been deleted
                    //Get all resume info again
                    resume.getAllUserResumeInformation(user.user_id);

                    helpers.saveActivityTrail(user.user_id, "Education Deleted", "You deleted an education with " +
                        name_of_institution + " from your resume.");

                    res.status(200).json({
                        message: "Education deleted."
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.get("/get-all-qualification", (req, res, next) => {
    try {
        //helpers.checkifAuthenticated(req, res);

        db.query(Resume.getAllQualification(), (err, data) => {
            if (!err) {
                res.status(200).json({
                    message: "All Qualification.",
                    qualifications: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post('/edit-candidate-education', function(req, res, next) {
    try {
        helpers.checkifAuthenticated(req, res);

        //read user information from request
        var name_of_institution = helpers.checkifUndefined(req.body.name_of_institution);
        var course_of_study = helpers.checkifUndefined(req.body.course_of_study);
        var qualification = helpers.checkifUndefined(req.body.qualification);
        var start_month = helpers.checkifUndefined(req.body.start_month);
        var start_year = helpers.checkifUndefined(req.body.start_year);
        var end_month = helpers.checkifUndefined(req.body.end_month);
        var end_year = helpers.checkifUndefined(req.body.end_year);
        var education_id = helpers.checkifUndefined(req.body.education_id);

        var start_date = start_month + ', ' + start_year;
        var end_date = end_month + ', ' + end_year;

        //Getting user
        var user = req.session.passport.user;

        var resume = new Resume();
        db.query(resume.updateEducationQuery(education_id, name_of_institution, course_of_study, qualification,
            start_date, end_date), (err, data) => {
            if (!err) {
                if (data) {
                    //Education has been edited
                    //Get all resume info again
                    //resume.getAllUserResumeInformation(user.user_id);

                    helpers.saveActivityTrail(user.user_id, "Education Edited", "You edited an education from " + name_of_institution + " in your resume.");

                    res.status(200).json({
                        message: "Education edited."
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});


// Project
router.post("/all-projects", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var resume_id = req.body.resume_id;

        db.query(Resume.getAllProjectByResumeIdQuery(resume_id), (err, data) => {
            if (!err) {
                res.status(200).json({
                    message: "All User's projects listed.",
                    projects: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post("/add-project/:resumeId", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        //read user information from request
        var project_title = req.body.project_title;
        var project_link = req.body.project_link;
        var project_description = req.body.project_description;

        var resume_id = req.params.resumeId;

        var resume = new Resume();

        db.query(resume.createProjectQuery(project_title, project_link, project_description), (err, data) => {
            if (!err) {
                if (data) {
                    var project_id = data.insertId;

                    db.query(Resume.insertResumeProjectQuery(resume_id, project_id), (err, data) => {
                        if (!err) {
                            res.status(200).json({
                                message: "Project added with ResumeProject mapping.",
                                resume_project_id: data.insertId
                            });
                        }
                    })
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post("/update-project/:projectId", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var project_id = req.params.projectId;

        var project_title = req.body.project_title;
        var project_link = req.body.project_link;
        var project_description = req.body.project_description;

        var resume = new Resume();
        db.query(resume.updateProjectQuery(project_id, project_title, project_link, project_description), (err, data) => {
            if (!err) {
                if (data && data.affectedRows > 0) {
                    res.status(200).json({
                        message: `Project updated with id = ${project_id}`,
                        affectedRows: data.affectedRows
                    });
                } else {
                    res.status(200).json({
                        message: "Project Not found."
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});


//Award
router.post("/all-awards", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var resume_id = req.body.resume_id;

        db.query(Resume.getAllAwardByResumeIdQuery(resume_id), (err, data) => {
            if (!err) {
                res.status(200).json({
                    message: "All User's Awards listed.",
                    awards: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post("/add-award/:resumeId", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        //read user information from request
        var certificate_name = req.body.certificate_name;
        var offered_by = req.body.offered_by;
        var date_received = req.body.date_received;

        var resume_id = req.params.resumeId;

        var resume = new Resume();

        db.query(resume.createAwardQuery(certificate_name, offered_by, date_received), (err, data) => {
            if (!err) {
                if (data) {
                    var award_id = data.insertId;

                    db.query(Resume.insertResumeAwardQuery(resume_id, award_id), (err, data) => {
                        if (!err) {
                            res.status(200).json({
                                message: "Award added with ResumeAward mapping.",
                                resume_award_id: data.insertId
                            });
                        }
                    })
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post("/update-award/:awardId", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var award_id = req.params.awardId;

        var certificate_name = req.body.certificate_name;
        var offered_by = req.body.offered_by;
        var date_received = req.body.date_received;

        var resume = new Resume();
        db.query(resume.updateAwardQuery(award_id, certificate_name, offered_by, date_received), (err, data) => {
            if (!err) {
                if (data && data.affectedRows > 0) {
                    res.status(200).json({
                        message: `Award updated with id = ${award_id}`,
                        affectedRows: data.affectedRows
                    });
                } else {
                    res.status(200).json({
                        message: "Award Not found."
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});


//Association
router.post("/all-associations", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var resume_id = req.body.resume_id;

        db.query(Resume.getAllAssociationByResumeIdQuery(resume_id), (err, data) => {
            if (!err) {
                res.status(200).json({
                    message: "All User's Associations listed.",
                    associations: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post("/add-association/:resumeId", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        //read user information from request
        var title = req.body.title;
        var name = req.body.name;

        var resume_id = req.params.resumeId;

        var resume = new Resume();

        db.query(resume.createAssociationQuery(title, name), (err, data) => {
            if (!err) {
                if (data) {
                    var association_id = data.insertId;

                    db.query(Resume.insertResumeAssociationQuery(resume_id, association_id), (err, data) => {
                        if (!err) {
                            res.status(200).json({
                                message: "Association added with ResumeAssociation mapping.",
                                resume_association_id: data.insertId
                            });
                        }
                    })
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post("/update-association/:associationId", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var association_id = req.params.associationId;

        var title = req.body.title;
        var name = req.body.name;

        var resume = new Resume();
        db.query(resume.updateAssociationQuery(association_id, title, name), (err, data) => {
            if (!err) {
                if (data && data.affectedRows > 0) {
                    res.status(200).json({
                        message: `Association updated with id = ${association_id}`,
                        affectedRows: data.affectedRows
                    });
                } else {
                    res.status(200).json({
                        message: "Association Not found."
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});


//Certification
router.post("/all-certifiactions", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var resume_id = req.body.resume_id;

        db.query(Resume.getAllCertificationByResumeIdQuery(resume_id), (err, data) => {
            if (!err) {
                res.status(200).json({
                    message: "All User's Certification listed.",
                    certifications: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post("/add-certification/:resumeId", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        //read user information from request
        var certification_name = req.body.certification_name;
        var certification_description = req.body.certification_description;

        var resume_id = req.params.resumeId;

        var resume = new Resume();

        db.query(resume.createCertificationQuery(certification_name, certification_description), (err, data) => {
            if (!err) {
                if (data) {
                    var certification_id = data.insertId;

                    db.query(Resume.insertResumeCertificationQuery(resume_id, certification_id), (err, data) => {
                        if (!err) {
                            res.status(200).json({
                                message: "Certification added with ResumeCertification mapping.",
                                resume_certification_id: data.insertId
                            });
                        }
                    })
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post("/update-certification/:certificationId", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var certification_id = req.params.certificationId;

        var certification_name = req.body.certification_name;
        var certification_description = req.body.certification_description;

        var resume = new Resume();
        db.query(resume.updateCertificationQuery(certification_id, certification_name, certification_description), (err, data) => {
            if (!err) {
                if (data && data.affectedRows > 0) {
                    res.status(200).json({
                        message: `Certification updated with id = ${certification_id}`,
                        affectedRows: data.affectedRows
                    });
                } else {
                    res.status(200).json({
                        message: "Certification Not found."
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post('/save-candidate-certification', function(req, res, next) {
    try {
        helpers.checkifAuthenticated(req, res);

        //read user information from request
        var certification_name = helpers.checkifUndefined(req.body.certification_name);
        var certification_description = helpers.checkifUndefined(req.body.certification_description);
        var month = helpers.checkifUndefined(req.body.date_obtained_month);
        var year = helpers.checkifUndefined(req.body.date_obtained_year);

        var date_obtained = month + ', ' + year;

        //Getting user resume_id
        var user = req.session.passport.user;

        var resume = new Resume();
        db.query(resume.createCertificationQuery(certification_name, certification_description,
            date_obtained), (err, data) => {
            if (!err) {
                if (data) {
                    var certification_id = data.insertId;
                    var resume_id = user.resume_id;

                    db.query(Resume.insertResumeCertificationQuery(resume_id, certification_id), (err, data) => {
                        if (!err) {
                            helpers.saveActivityTrail(user.user_id, "Certification Added",
                                "You added a certification to your resume.");

                            res.status(200).json({
                                message: "Certification added with ResumeCertification mapping.",
                                resume_certification_id: data.insertId
                            });
                        }
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post('/delete-candidate-certification', function(req, res, next) {
    try {
        helpers.checkifAuthenticated(req, res);

        var certification_id = req.body.certification_id;

        //Getting user resume_id
        var user = req.session.passport.user;

        var resume = new Resume();
        db.query(resume.deleteCertificationQuery(certification_id), (err, data) => {
            if (!err) {
                if (data) {
                    helpers.saveActivityTrail(user.user_id, "Certification Deleted",
                        "You deleted a certification from your resume.");

                    res.status(200).json({
                        message: "Certification deleted."
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post('/edit-candidate-certification', function(req, res, next) {
    try {
        helpers.checkifAuthenticated(req, res);

        //read user information from request
        var certification_id = helpers.checkifUndefined(req.body.certification_id);
        var certification_name = helpers.checkifUndefined(req.body.certification_name);
        var certification_description = helpers.checkifUndefined(req.body.certification_description);
        var month = helpers.checkifUndefined(req.body.date_obtained_month);
        var year = helpers.checkifUndefined(req.body.date_obtained_year);

        var date_obtained = month + ', ' + year;

        //Getting user
        var user = req.session.passport.user;

        var resume = new Resume();
        db.query(resume.updateCertificationQuery(certification_id, certification_name, certification_description,
            date_obtained), (err, data) => {
            if (!err) {
                if (data) {
                    helpers.saveActivityTrail(user.user_id, "Certification Edited",
                        "You edited a certification in your resume.");

                    res.status(200).json({
                        message: "Certification edited."
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});


//Work Experience
router.post("/all-experiences", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var resume_id = req.body.resume_id;

        db.query(Resume.getAllWorkExperienceByResumeIdQuery(resume_id), (err, data) => {
            if (!err) {
                res.status(200).json({
                    message: "All User's Work Experience listed.",
                    experiences: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post("/add-experience/:resumeId", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        //read user information from request
        var job_title = req.body.job_title;
        var employer_name = req.body.employer_name;
        var employer_address = req.body.employer_address;
        var monthly_salary = req.body.monthly_salary;
        var job_type = req.body.job_type;
        var job_level = req.body.job_level;
        var start_date = req.body.start_date;
        var end_date = req.body.end_date;

        var resume_id = req.params.resumeId;

        var resume = new Resume();

        db.query(resume.createWorkExperienceQuery(job_title, employer_name, employer_address, monthly_salary, job_type, job_level,
            start_date, end_date, job_responsibility), (err, data) => {
            if (!err) {
                if (data) {
                    var experience_id = data.insertId;

                    db.query(Resume.insertResumeWorkExperienceQuery(resume_id, experience_id), (err, data) => {
                        if (!err) {
                            res.status(200).json({
                                message: "Experience added with ResumeW.E mapping.",
                                resume_experience_id: data.insertId
                            });
                        }
                    })
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post("/update-experience/:experienceId", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var experience_id = req.params.experienceId;

        var job_title = req.body.job_title;
        var employer_name = req.body.employer_name;
        var employer_address = req.body.employer_address;
        var monthly_salary = req.body.monthly_salary;
        var job_type = req.body.job_type;
        var job_level = req.body.job_level;
        var start_date = req.body.start_date;
        var end_date = req.body.end_date;

        var resume = new Resume();
        db.query(resume.updateWorkExperienceQuery(experience_id, job_title, employer_name, employer_address, monthly_salary, job_type,
            job_level, start_date, end_date, job_responsibility), (err, data) => {
            if (!err) {
                if (data && data.affectedRows > 0) {
                    res.status(200).json({
                        message: `Experience updated with id = ${experience_id}`,
                        affectedRows: data.affectedRows
                    });
                } else {
                    res.status(200).json({
                        message: "Experience Not found."
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post('/save-candidate-experience', function(req, res, next) {
    try {
        helpers.checkifAuthenticated(req, res);

        //read user information from request
        var company_name = helpers.checkifUndefined(req.body.company_name);
        var job_title = helpers.checkifUndefined(req.body.job_title);
        var state = helpers.checkifUndefined(req.body.state);
        var country = helpers.checkifUndefined(req.body.country);
        var start_month = helpers.checkifUndefined(req.body.start_month);
        var start_year = helpers.checkifUndefined(req.body.start_year);
        var end_month = helpers.checkifUndefined(req.body.end_month);
        var end_year = helpers.checkifUndefined(req.body.end_year);
        var job_description = helpers.checkifUndefined(req.body.job_description);

        var employer_address = state + ', ' + country;
        var start_date = start_month + ', ' + start_year;
        var end_date = end_month + ', ' + end_year;

        //Getting user resume_id
        var user = req.session.passport.user;

        var resume = new Resume();

        db.query(resume.createWorkExperienceQuery(job_title, company_name, employer_address,
            start_date, end_date, job_description, user.user_id), (err, data) => {
            if (!err) {
                if (data) {
                    var experience_id = data.insertId;
                    var resume_id = user.resume_id;

                    db.query(Resume.insertResumeWorkExperienceQuery(resume_id, experience_id), (err, data) => {
                        if (!err) {
                            //Experience has been added
                            //Get all resume info again
                            //resume.getAllUserResumeInformation(user.user_id);

                            helpers.saveActivityTrail(user.user_id, "Experience added", "You added an experience from " + company_name + " to your resume.");

                            res.status(200).json({
                                message: "Experience added with ResumeW.E mapping.",
                                resume_experience_id: data.insertId
                            });
                        }
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post('/delete-candidate-experience', function(req, res, next) {
    try {
        helpers.checkifAuthenticated(req, res);

        var experience_id = req.body.experience_id;
        var company_name = req.body.company_name;

        //Getting user resume_id
        var user = req.session.passport.user;

        var resume = new Resume();
        db.query(resume.deleteWorkExperienceQuery(experience_id), (err, data) => {
            if (!err) {
                if (data) {
                    //Experience has been deleted
                    //Get all resume info again
                    //resume.getAllUserResumeInformation(user.user_id);

                    helpers.saveActivityTrail(user.user_id, "Experience Deleted", "You deleted an experience with " + company_name + " from your resume.");

                    res.status(200).json({
                        message: "Experience deleted."
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post('/edit-candidate-experience', function(req, res, next) {
    try {
        helpers.checkifAuthenticated(req, res);

        //read user information from request
        var company_name = helpers.checkifUndefined(req.body.company_name);
        var job_title = helpers.checkifUndefined(req.body.job_title);
        var state = helpers.checkifUndefined(req.body.state);
        var country = helpers.checkifUndefined(req.body.country);
        var start_month = helpers.checkifUndefined(req.body.start_month);
        var start_year = helpers.checkifUndefined(req.body.start_year);
        var end_month = helpers.checkifUndefined(req.body.end_month);
        var end_year = helpers.checkifUndefined(req.body.end_year);
        var job_description = helpers.checkifUndefined(req.body.job_description);
        var experience_id = helpers.checkifUndefined(req.body.experience_id);

        var employer_address = state + ', ' + country;
        var start_date = start_month + ', ' + start_year;
        var end_date = end_month + ', ' + end_year;

        //Getting user
        var user = req.session.passport.user;

        var resume = new Resume();
        db.query(resume.updateWorkExperienceQuery(experience_id, job_title, company_name, employer_address,
            start_date, end_date, job_description), (err, data) => {
            if (!err) {
                if (data) {
                    //Experience has been edited
                    //Get all resume info again
                    //resume.getAllUserResumeInformation(user.user_id);

                    helpers.saveActivityTrail(user.user_id, "Experience Edited", "You edited an experience from " + company_name + " in your resume.");

                    res.status(200).json({
                        message: "Experience edited."
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }
});


//Skill
router.post("/update-candidate-skills", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        //read user information from request
        var skills = req.body.skills;
        var skills_array = skills.split(',');

        var userData = req.session.passport.user;
        var user_id = userData.user_id;
        var resume_id = userData.resume_id;

        //Removing all candidate skills first before adding them all again
        db.query(Resume.removeAllCandidateSkillsByResumeId(resume_id), (err, data) => {
            if (err) { logger.log(err) } else {
                if (skills) {
                    for (var i = 0; i < skills_array.length; i++) {
                        db.query(Resume.insertResumeSkillQuery(resume_id, user_id, skills_array[i]), (err, data) => {
                            if (err) { logger.log(err); } else {
                                //if (i == skills_array.length - 1) {   
                                //}
                            }
                        });
                    }

                    res.status(200).json({
                        message: "Skills added with ResumeSkills mapping.",
                        //resume_skills_id: data.insertId
                    });
                } else {
                    res.status(200).json({
                        message: "Skills added with ResumeSkills mapping.",
                        resume_skills_id: 0
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});


//Language
router.post("/all-languages", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var resume_id = req.body.resume_id;

        db.query(Resume.getAllLanguageByResumeIdQuery(resume_id), (err, data) => {
            if (!err) {
                res.status(200).json({
                    message: "All User's Language listed.",
                    languages: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post("/add-language/:resumeId", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        //read user information from request
        var language = req.body.language;
        var language_level = req.body.language_level;

        var resume_id = req.params.resumeId;

        var resume = new Resume();

        db.query(resume.createLanguageQuery(language, language_level), (err, data) => {
            if (!err) {
                if (data) {
                    var language_id = data.insertId;

                    db.query(Resume.insertResumeLanguageQuery(resume_id, language_id), (err, data) => {
                        if (!err) {
                            res.status(200).json({
                                message: "Language added with ResumeLanguage mapping.",
                                resume_language_id: data.insertId
                            });
                        }
                    })
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post("/update-language/:languageId", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var language_id = req.params.languageId;

        var language = req.body.language;
        var language_level = req.body.language_level;

        var resume = new Resume();
        db.query(resume.updateLanguageQuery(language_id, language, language_level), (err, data) => {
            if (!err) {
                if (data && data.affectedRows > 0) {
                    res.status(200).json({
                        message: `Language updated with id = ${language_id}`,
                        affectedRows: data.affectedRows
                    });
                } else {
                    res.status(200).json({
                        message: "Language Not found."
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});


//Specialization
router.post("/all-specializations", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var resume_id = req.body.resume_id;

        db.query(Resume.getAllSpecializationByResumeIdQuery(resume_id), (err, data) => {
            if (!err) {
                res.status(200).json({
                    message: "All User's Specialization listed.",
                    specializations: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post("/add-specialization/:resumeId", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        //read user information from request
        var specialization_name = req.body.specialization_name;
        var specialization_description = req.body.specialization_description;

        var resume_id = req.params.resumeId;

        var resume = new Resume();

        db.query(resume.createSpecializationQuery(specialization_name, specialization_description), (err, data) => {
            if (!err) {
                if (data) {
                    var specialization_id = data.insertId;

                    db.query(Resume.insertResumeSpecializationQuery(resume_id, specialization_id), (err, data) => {
                        if (!err) {
                            res.status(200).json({
                                message: "Specialization added with ResumeSpecialization mapping.",
                                resume_specialization_id: data.insertId
                            });
                        }
                    })
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post("/update-specialization/:specializationId", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var specialization_id = req.params.specializationId;

        var specialization_name = req.body.specialization_name;
        var specialization_description = req.body.specialization_description;

        var resume = new Resume();
        db.query(resume.updateSpecializationQuery(specialization_id, specialization_name, specialization_description), (err, data) => {
            if (!err) {
                if (data && data.affectedRows > 0) {
                    res.status(200).json({
                        message: `Specialization updated with id = ${specialization_id}`,
                        affectedRows: data.affectedRows
                    });
                } else {
                    res.status(200).json({
                        message: "Specialization Not found."
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});


//Referee
router.post("/all-referees", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var resume_id = req.body.resume_id;

        db.query(Resume.getAllRefereeByResumeIdQuery(resume_id), (err, data) => {
            if (!err) {
                res.status(200).json({
                    message: "All User's Referee listed.",
                    referees: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post("/add-referee/:resumeId", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        //read user information from request
        var name = req.body.name;
        var phone_number = req.body.phone_number;
        var email = req.body.email;
        var relationship = req.body.relationship;
        var no_of_years = req.body.no_of_years;
        var address = req.body.address;

        var resume_id = req.params.resumeId;

        var resume = new Resume();

        db.query(resume.createRefereeQuery(name, phone_number, email, relationship, no_of_years, address), (err, data) => {
            if (!err) {
                if (data) {
                    var referee_id = data.insertId;

                    db.query(Resume.insertResumeRefereeQuery(resume_id, referee_id), (err, data) => {
                        if (!err) {
                            res.status(200).json({
                                message: "Referee added with ResumeReferee mapping.",
                                resume_referee_id: data.insertId
                            });
                        }
                    })
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post("/update-referee/:refereeId", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var referee_id = req.params.refereeId;

        var name = req.body.name;
        var phone_number = req.body.phone_number;
        var email = req.body.email;
        var relationship = req.body.relationship;
        var no_of_years = req.body.no_of_years;
        var address = req.body.address;

        var resume = new Resume();
        db.query(resume.updateRefereeQuery(referee_id, name, phone_number, email, relationship, no_of_years, address), (err, data) => {
            if (!err) {
                if (data && data.affectedRows > 0) {
                    res.status(200).json({
                        message: `Referee updated with id = ${referee_id}`,
                        affectedRows: data.affectedRows
                    });
                } else {
                    res.status(200).json({
                        message: "Referee Not found."
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }

});


module.exports = router;