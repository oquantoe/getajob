var express = require('express');
var db = require('../db/database');
var Assessment = require('../models/assessment');
var Job = require('../models/job');
var User = require('../models/user');
var config = require('../config/config');
var helpers = require('./../config/helpers');
var logger = require('./../config/log4js');
var mailer = require('../config/mail/mailer');

const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        db.query(Assessment.getAllAssessmentsQuery(), (err, data) => {
            if (!err) {
                res.status(200).json({
                    message: "Assessments listed.",
                    assessments: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post("/add", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        //read user information from request
        var assessment_name = req.body.assessment_name;
        var assessment_type = req.body.assessment_type;
        var job_assigned_to = req.body.job_assigned_to;
        var description = req.body.assessment_description;
        var timer = req.body.assessment_time;
        var pass_percentage = req.body.pass_percentage;

        var userData = req.session.passport.user;
        var user_id = userData.user_id;
        var recruiter_full_name = userData.first_name + ' ' + userData.last_name;
        var recruiter_email = userData.email;

        var assessment = new Assessment();
        db.query(assessment.createAssessmentQuery(assessment_name, assessment_type, job_assigned_to,
            description, timer, pass_percentage, user_id), (err, data) => {

            if (err) { logger.error(err) } else {

                helpers.saveActivityTrail(user_id, "Assessment Created",
                    "You have created an assessment titled (" + assessment_name + ").");

                mailer.sendCreateAssessmentMail(recruiter_full_name, recruiter_email, assessment_name);

                res.status(200).json({
                    message: "Assessment added.",
                    assessmentId: data.insertId
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.get("/get-create-assessment-params", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        db.query(Job.getAllPostedJobsToBeAssigned(user_id), (err, data) => {
            if (!err) {
                var allJobs = data;

                for (var i = 0; i < allJobs.length; i++) {
                    allJobs[i].value = allJobs[i].value.toString();
                }

                db.query(Assessment.getAllAssessmentTypes(), (err, data) => {
                    if (!err) {
                        var allAssessmentTypes = data;

                        res.status(200).json({
                            message: "All Params",
                            assessment_types: allAssessmentTypes,
                            jobs: allJobs
                        });
                    }
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post("/get-edit-assessment-params", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var assessment_id = req.body.assessment_id;
        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        db.query(Job.getAllPostedJobsToBeAssigned(user_id), (err, data) => {
            if (!err) {
                var allJobs = data;

                for (var i = 0; i < allJobs.length; i++) {
                    allJobs[i].value = allJobs[i].value.toString();
                }

                db.query(Assessment.getAllAssessmentTypes(), (err, data) => {
                    if (!err) {
                        var allAssessmentTypes = data;

                        db.query(Assessment.getAllAssessmentQuestions(assessment_id), (err, data) => {
                            if (!err) {
                                var allQuestions = data;

                                res.status(200).json({
                                    message: "All Params",
                                    assessment_types: allAssessmentTypes,
                                    jobs: allJobs,
                                    questions: allQuestions
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

router.get("/get-all-recruiters-assessments", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        db.query(Assessment.getAllAssessmentsByRecruiter(user_id), (err, data) => {
            if (!err) {
                for (var i = 0; i < data.length; i++) {
                    data[i].date_time_ago = helpers.getCurrentTimeAgo(data[i].date_created);
                }

                res.status(200).json({
                    message: "All Assessments",
                    assessments: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post("/create-questions", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        //read user information from request
        var assessment_id = req.body.assessment_id;
        var question_set = JSON.parse(req.body.question_set);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        var assessment = new Assessment();

        for (var i = 0; i < question_set.length; i++) {
            var question_no = question_set[i].index;
            var question = question_set[i].question;
            var question_type = question_set[i].question_type;
            var correct_answer = question_set[i].correct_answer;
            var score = question_set[i].score;
            var time_to_answer = question_set[i].time;

            var options = question_set[i].options;
            var option_a = options[0];
            var option_b = options[1];
            var option_c = options[2];
            var option_d = options[3];

            db.query(assessment.createQuestion(assessment_id, question_no, question, question_type, option_a,
                option_b, option_c, option_d, correct_answer, score, time_to_answer, user_id), (err, data) => {
                if (err) { logger.error(err) }
            });
        }

        res.status(200).json({
            message: "Questions added.",
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post("/edit-questions", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        //read user information from request
        var assessment_id = req.body.assessment_id;
        var question_set = JSON.parse(req.body.question_set);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        var assessment = new Assessment();

        var ifCompleted = false;

        for (var i = 0; i < question_set.length; i++) {
            var question_id = question_set[i].question_id;
            var question_no = question_set[i].index;
            var question = question_set[i].question;
            var question_type = question_set[i].question_type;
            var correct_answer = question_set[i].correct_answer;
            var score = question_set[i].score;
            var time_to_answer = question_set[i].time;

            var options = question_set[i].options;
            var option_a = options[0];
            var option_b = options[1];
            var option_c = options[2];
            var option_d = options[3];

            //If a new question has been added, create new question; else edit
            if (typeof question_id == 'undefined') {
                db.query(assessment.createQuestion(assessment_id, question_no, question, question_type, option_a,
                    option_b, option_c, option_d, correct_answer, score, time_to_answer, user_id), (err, data) => {
                    if (!err) {
                        ifCompleted = true;
                    }
                });
            } else {
                db.query(assessment.editQuestion(question_id, question_no, question, question_type, option_a,
                    option_b, option_c, option_d, correct_answer, score, time_to_answer), (err, data) => {
                    if (!err) {
                        ifCompleted = true;
                    }
                });
            }
            logger.log('ifCompleted - ' + ifCompleted)
        }

        res.status(200).json({
            message: "Questions saved successfully.",
            result: true
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post('/process-assessment-submission', (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        console.log('about to process');

        //read user information from request
        var assessment_id = req.body.assessment_id;
        var selected_answers = JSON.parse(req.body.selected_answers);

        console.log(selected_answers);

        var candidateData = req.session.passport.user;
        var user_id = candidateData.user_id;

        var assessment = new Assessment();
        db.query(assessment.getAssessmentByAssessmentId(assessment_id), (err, data) => {
            if (err) { logger.log(err) } else {
                var assessmentData = data[0];

                processSubmission(res, assessmentData, selected_answers, candidateData)
            }
        });





    } catch (error) {
        logger.log(error);
    }
});

function processSubmission(res, assessmentData, selected_answers, candidateData) {
    var assessment = new Assessment();

    //Sort questions using q_id in ASC order
    selected_answers = selected_answers.sort(function(a, b) { return a.q_id - b.q_id });

    var concatenated_ids = '';

    for (var i = 0; i < selected_answers.length; i++) {
        concatenated_ids += selected_answers[i].q_id;

        if (i < selected_answers.length - 1) {
            concatenated_ids += ',';
        }
    }

    db.query(assessment.getQuestionForMultipleQuestionIds(concatenated_ids), (err, data) => {
        if (err) { logger.error(err); } else {

            var total_score = 0;
            var maximum_score_possible = 0;

            console.log('question - ');
            console.log(data);
            var questions = data;

            for (var i = 0; i < selected_answers.length; i++) {
                var question = questions[i];

                var submitted_question_id = selected_answers[i].q_id;
                var submitted_question_type = selected_answers[i].q_t;
                var submitted_chosen_answer = selected_answers[i].chosen_answer;
                //var time_to_answer = question_set[i].time;

                console.log('submitted_question_id - ' + submitted_question_id);
                console.log('submitted_question_type - ' + submitted_question_type);
                console.log('submitted_chosen_answer - ' + submitted_chosen_answer);

                maximum_score_possible += Number(question.score);

                if (question.question_type == "1") {

                    console.log('question.correct_answer - ' + question.correct_answer);
                    console.log('question.score - ' + Number(question.score));

                    if (submitted_chosen_answer === question.correct_answer) {
                        total_score += Number(question.score);
                        console.log("Question " + submitted_question_id + " is correct");
                    } else {
                        total_score += 0;
                        console.log("Question " + submitted_question_id + " is wrong");
                    }

                    console.log('total_score inif - ' + total_score);
                } else if (question.question_type == "2") {

                    console.log('question.correct_answer - ' + question.correct_answer);
                    console.log('typeof question.correct_answer - ' + typeof(question.correct_answer));
                    console.log('submitted_chosen_answer - ' + submitted_chosen_answer);
                    console.log('typeof submitted_chosen_answer - ' + typeof(submitted_chosen_answer));
                    console.log('question.score - ' + Number(question.score));

                    //if (JSON.stringify(submitted_chosen_answer) === JSON.stringify(question.correct_answer)) {
                    if (submitted_chosen_answer.toString() === question.correct_answer.toString()) {
                        total_score += Number(question.score);
                        console.log("Question " + submitted_question_id + " is correct");
                    } else {
                        total_score += 0;
                        console.log("Question " + submitted_question_id + " is wrong");
                    }

                    console.log('total_score inelse - ' + total_score);
                }
            }

            var score_percentage = (total_score / maximum_score_possible) * 100;
            var grade = (Number(score_percentage) >= Number(assessmentData.pass_percentage)) ? config.passed : config.failed;
            var time_spent = '';
            var date_created = helpers.getCurrentTimeStamp();

            console.log('score_percentage - ' + score_percentage);
            console.log('grade - ' + grade);
            console.log('final total_score - ' + total_score);
            console.log('maximum_score_possible - ' + maximum_score_possible);

            db.query(assessment.saveAssessmentScore(assessmentData.assessment_id, candidateData.user_id,
                total_score, maximum_score_possible, score_percentage, grade, time_spent, date_created), (err, data) => {

                if (err) { logger.error(err); } else {
                    console.log("score saved")

                    var job = new Job();
                    db.query(job.getJobNameWithRecruiterData(assessmentData.job_assigned_to), (err, data) => {
                        if (err) { logger.error(err); } else {
                            var jobData = data[0];

                            var job_name = jobData.job_name;
                            var recruiter_full_name = jobData.first_name + ' ' + jobData.last_name;
                            var recruiter_email = jobData.email;

                            var candidate_full_name = candidateData.first_name + ' ' + candidateData.last_name;
                            var candidate_email = candidateData.email;

                            // Send mail to candidate
                            mailer.sendAssessmentSubmissionMailToCandidate(candidate_full_name, candidate_email, job_name);

                            // Send mail to recruiter
                            mailer.sendAssessmentSubmissionMailToRecruiter(recruiter_full_name, recruiter_email,
                                candidate_full_name, job_name, assessmentData.assessment_name);

                            res.status(200).json({
                                message: "Score saved"
                            });
                            // Send respose back to html saying thanks and recruiter will get intouch with you
                            // close page after ok
                        }
                    });
                }
            });
        }
    });

}

function processSubmissionOld(assessment_id, selected_answers) {
    var assessment = new Assessment();

    var total_score = 0;

    for (var i = 0; i < selected_answers.length; i++) {
        var submitted_question_id = selected_answers[i].q_id;
        var submitted_question_type = selected_answers[i].q_t;
        var submitted_chosen_answer = selected_answers[i].chosen_answer;
        //var time_to_answer = question_set[i].time;

        console.log('submitted_question_id - ' + submitted_question_id);
        console.log('submitted_question_type - ' + submitted_question_type);


        db.query(assessment.getQuestionForQuestionId(submitted_question_id), (err, data) => {
            if (err) { logger.error(err); } else {
                var question = data[0];

                console.log('question - ');
                console.log(question);

                console.log('submitted_chosen_answer - ' + submitted_chosen_answer);

                if (question.question_type == "1") {

                    console.log('question.correct_answer - ' + question.correct_answer);
                    console.log('question.score - ' + question.score);

                    if (submitted_chosen_answer === question.correct_answer) {
                        total_score += question.score;
                    } else {
                        total_score += 0;
                    }

                    console.log('total_score inif - ' + total_score);
                } else if (question.question_type == "2") {

                    console.log('question.correct_answer - ' + question.correct_answer);
                    console.log('question.score - ' + question.score);

                    console.log('total_score inelse - ' + total_score);
                }


            }
        });

        console.log('total_score inloop - ' + total_score);
    }

}

router.post("/edit-assessment-data", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        //read user information from request
        var assessment_id = req.body.assessment_id;
        var assessment_name = req.body.assessment_name;
        var assessment_type = req.body.assessment_type;
        var job_assigned_to = req.body.job_assigned_to;
        var description = req.body.assessment_description;
        var timer = req.body.assessment_time;
        var pass_percentage = req.body.pass_percentage;

        var assessment = new Assessment();
        db.query(assessment.editAssessmentQuery(assessment_id, assessment_name, assessment_type, job_assigned_to,
            description, timer, pass_percentage), (err, data) => {

            if (data) {
                res.status(200).json({
                    message: "Assessment edited.",
                    result: true
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get('/assessment-detail/:assessmentId', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var assessment_id = req.params.assessmentId;
        var userData = req.session.passport.user;

        var assessment = new Assessment();
        db.query(assessment.getAssessmentByAssessmentId(assessment_id), (err, data) => {
            if (err) { logger.log(err) } else {
                var assessmentData = data[0];

                res.render('recruiter_view_assessment', {
                    view: 'assessments',
                    data: userData,
                    assessmentData: assessmentData
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.post('/get-all-assessment-candidates', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var assessment_id = req.body.assessment_id;
        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        var assessment = new Assessment();
        db.query(assessment.getAllAssessmentCandidates(assessment_id), (err, data) => {
            if (err) { logger.log(err) } else {
                var allAssessmentCandidates = data;

                var total_score = 0;

                for (var i = 0; i < allAssessmentCandidates.length; i++) {
                    allAssessmentCandidates[i].date_attempted = helpers.formatDateTime(allAssessmentCandidates[i].date_created);
                    allAssessmentCandidates[i].photo_url = allAssessmentCandidates[i].photo_url.replace('/uploads/images/profile_pictures/', config.azure_profile_pic_url);

                    total_score += parseInt(allAssessmentCandidates[i].score);
                }

                var average_score = (total_score / allAssessmentCandidates.length)
                average_score = Math.round(average_score * 10) / 10; //Round up to 1 decimal place
                logger.log('average_score - ' + average_score);

                res.status(200).json({
                    message: "All Assessment Candidates",
                    candidates: allAssessmentCandidates,
                    average_score: average_score
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

});

router.get('/edit-assessment/:assessmentId', function(req, res) {
    try {
        helpers.checkifAuthenticated(req, res);

        var assessmentId = req.params.assessmentId;
        var userData = req.session.passport.user;

        var assessment = new Assessment();
        db.query(assessment.getAssessmentByAssessmentId(assessmentId), (err, data) => {
            if (!err) {
                var assessmentData = data[0];

                res.render('recruiter_edit_assessment', {
                    view: 'assessments',
                    data: userData,
                    assessmentData: assessmentData
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post('/delete-assessment', (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var assessment_id = req.body.assessment_id;
        var assessment_name = req.body.assessment_name;

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        db.query(Assessment.deleteAssessmentByIdQuery(assessment_id), (err, data) => {
            if (!err) {
                if (data && data.affectedRows > 0) {

                    helpers.saveActivityTrail(user_id, "Assessment Deleted", "You have deleted your assessment.");

                    res.status(200).json({
                        message: 'Assessment deleted.',
                        affectedRows: data.affectedRows
                    });
                } else {
                    res.status(200).json({
                        message: "Assessment Not found."
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post('/share-assessment', (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        var assessment_id = req.body.assessment_id;

        logger.log("Sending Assessment Mail to Candidates")

        var assessment = new Assessment();
        db.query(assessment.getAssessmentByAssessmentId(assessment_id), (err, data) => {
            if (err) { logger.log(err) } else {
                var assessmentData = data[0];

                db.query(Job.getAllShortlistedJobApplicants(assessmentData.job_assigned_to), (err, data) => {
                    if (err) { logger.log(err) } else {
                        var shortlisted_applicants = data;

                        if (shortlisted_applicants.length > 0) {
                            for (var i = 0; i < shortlisted_applicants.length; i++) {
                                var applicant_full_name = shortlisted_applicants[i].first_name + ' ' + shortlisted_applicants[i].last_name;
                                var applicant_email = shortlisted_applicants[i].email;

                                logger.log("Sending Assessment Mail to id: " + shortlisted_applicants[i].user_id)
                                mailer.sendAssessmentMailToCandidate(applicant_full_name, applicant_email, assessmentData);
                            }
                        }

                        helpers.saveActivityTrail(user_id, "Assessment Shared",
                            "You shared the (" + assessmentData.assessment_name + ") assessment to " + shortlisted_applicants.length + " candidates.");

                        mailer.sendAssessmentMailToRecruiter(userData, assessmentData, shortlisted_applicants.length);

                        res.status(200).json({
                            message: 'Assessment Shared.',
                            data: shortlisted_applicants.length
                        });
                    }
                });
            }
        });

    } catch (error) {
        logger.log(error);
    }
});

router.get('/take-assessment/:assessmentToken', function(req, res) {
    try {
        //helpers.checkifAuthenticated(req, res);

        var assessmentToken = req.params.assessmentToken;

        var assessment = new Assessment();
        db.query(assessment.getAssessmentInfoByToken(assessmentToken), (err, data) => {
            if (err) { logger.error(err) } else {
                var assessmentData = data[0];

                res.redirect('/assessments/assessment-info/' + assessmentData.assessment_id);
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get('/assessment-info/:assessmentId', function(req, res) {
    try {
        //helpers.checkifAuthenticated(req, res);

        var assessmentId = req.params.assessmentId;

        var assessment = new Assessment();
        db.query(assessment.getAssessmentByAssessmentId(assessmentId), (err, data) => {
            if (err) { logger.error(err) } else {
                var assessmentData = data[0];

                res.render('assessment_info_page', {
                    assessmentData: assessmentData
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get('/start-test/:assessmentToken', function(req, res) {
    try {
        // helpers.checkifAuthenticated(req, res);

        var assessmentToken = req.params.assessmentToken;

        if (typeof req.session.passport != 'undefined' || req.session.passport || req.session.passport != null) {
            var userData = req.session.passport.user;

            var assessment = new Assessment();
            db.query(assessment.getAssessmentInfoByToken(assessmentToken), (err, data) => {
                if (err) { logger.error(err) } else {
                    var assessmentData = data[0];

                    res.render('assessment_question_page', {
                        userData: userData,
                        assessmentData: assessmentData
                    });
                }
            });
        } else {
            res.redirect('/login?f=start_test&t=' + assessmentToken);
        }

    } catch (error) {
        logger.log(error);
    }
});

router.post('/get-assessment-questions', (req, res, next) => {
    try {
        //helpers.checkifAuthenticated(req, res);

        var assessment_id = req.body.assessment_id;

        db.query(Assessment.getAllAssessmentQuestions(assessment_id), (err, data) => {
            if (err) { logger.error(err) } else {
                var questionsData = data;

                res.status(200).json({
                    message: "All Questions",
                    questionsData: questionsData
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});


module.exports = router;