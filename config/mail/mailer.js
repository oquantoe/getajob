var storage = require('./../session_store');
var config = require('./../config');
var logger = require('./../log4js');
var mailTransport = require('./mail_transport');
var sendgridMailTransport = require('./sendgrid_transport');
var helpers = require('./../helpers');
var db = require('./../../db/database');
var User = require('./../../models/user');
var mail = require('@sendgrid/mail');
var crypto = require('crypto');
var Resume = require('../../models/resume');

var mailFunctions = {

    sendCandidateWelcomeMail: function(req, user_id, fullName, recipient_email) {
        try {
            //var token = helpers.generateActivationToken();
            var token = crypto.randomBytes(64).toString('hex');

            var resume = new Resume();
            db.query(resume.saveUserActivationToken(user_id, token), (err, data) => {
                if (!err) {
                    logger.log("User Token saved!");
                }
            });

            //var pre_link = 'https://' + req.get('host');
            var link = 'https://getajobng.com/auth/verify/' + user_id + '/' + token;
            //var fullLink = pre_link + link;

            var mailOptions = {
                from: config.from, // sender address
                to: recipient_email, // list of receivers
                subject: 'Welcome to GetaJobNG',
                text: 'Welcome',
                html: '<p>Hi <b>' + fullName + '</b>. Welcome to <b>GetaJobNG</b>.</p> \
                <p>Please click on the link below to activate your account:</p> \
                <p><a href="' + link + '">Activate Account</a></p> \
                <p>Best Regards,</p> \
                <p>Mr. Jobs</p>'
            }

            //sendgridMailTransport.sendMail(mailOptions);
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }

    },

    sendRecruiterWelcomeMail: function(fullName, recipient_email) {
        try {
            var mailOptions = {
                from: config.from, // sender address
                to: recipient_email, // list of receivers
                subject: 'Welcome to GetaJobNG',
                text: 'Welcome',
                html: '<p>Hi <b>' + fullName + '</b>.</p> \
                <p>Welcome to <b>GetaJobNG</b> and thank you for coming on-board.</p> \
                <p>We would perform a KYC on your account based on the information and documents \
                you uploaded during registration. This process is just to know you better.</p> \
                <p><b>NOTE:</b> Your information & documents WILL NOT be shared to anybody.</p> \
                <p>You can view our <a href="https://getajobng.com/privacy-policy" target="_blank">Privacy Policy</a> for more information.</p> \
                <p>Best Regards,</p> \
                <p>Mr. Jobs</p>'
            }

            //sendgridMailTransport.sendMail(mailOptions);
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }

    },

    sendApplyToJobMail: function() {
        try {
            var mailOptions = {
                from: config.from, // sender address
                to: 'tobiloba.williams@c-ileasing.com', // list of receivers
                subject: 'We have a Job for you',
                text: 'Welcome',
                html: '<p>Hi! Good morning.</p> \
                <p>My name is Mr. Jobs and I have some awesome Slickline jobs for you.</p> \
                <p>Please click on the links below to apply.</p> \
                <ol> \
                <li><b>Slickline Operator:</b> <a href="https://getajobng.com/job-detail/3453" target="_blank">Click here to Apply</a></li> \
                <li><b>Slickline Chief Operator:</b> <a href="https://getajobng.com/job-detail/3453" target="_blank">Click here to Apply</a></li> \
                </ol>\
                <p>Please, don\'t forget to register, fill your profile and upload your CV/Resume.</p> \
                <p>You can also refer a friend.</p> \
                <p>Best Regards,</p> \
                <p>Mr. Jobs</p>'
            }

            //sendgridMailTransport.sendMail(mailOptions);
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendJobApplicationMailOld: function(recipient_full_name, recipient_email, job_name) {
        try {
            var mailOptions = {
                from: config.from, // sender address
                to: recipient_email, // list of receivers
                subject: 'Thank you for your recent job application',
                text: 'Welcome',
                html: '<p>Dear ' + recipient_full_name + ',</p>\
                        <p>Thank you for your recent application to the following job vacancy:</p> \
                        <p><b>' + job_name + '</b></p> \
                        <p>Improve your chances of being hired. ' +
                    'Sign up for Job Alerts to receive the vacancies you are looking for straight to your inbox. ' +
                    'Keep your profile and CV updated so recruiters can find you when they have an opportunity for you! ' +
                    'Good luck with the search.</p> \
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'
            }

            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendJobApplicationMail: function(recipient_full_name, recipient_email, job_name) {
        try {
            var mailOptions = {
                from: config.from, // sender address
                to: recipient_email, // list of receivers
                subject: 'Thank you for your recent job application',
                text: 'Welcome',
                html: '<p>Dear ' + recipient_full_name + ',</p>\
                        <p>Thank you for your recent application to the following job vacancy:</p> \
                        <p><b>' + job_name + '</b></p> \
                        In the event that you do meet the requirements in the interview stage, your CV/resume \
                        would be kept in view against other future opportunities.</p> \
                        <p>We wish you good luck.</p> \
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'
            }

            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendSuccessShortlistMail: function(recipient_full_name, recipient_email, job_name) {
        try {
            var mailOptions = {
                from: config.from, // sender address
                to: recipient_email, // list of receivers
                subject: 'You have been shortlistled.',
                text: 'Success Shortlist',
                html: '<p>Dear ' + recipient_full_name + ',</p>\
                        <p>Congratulations! You have successfully been shortlisted for the said role:</p> \
                        <p><b>' + job_name + '</b></p> \
                        <p>A call would be made to you in due course for your next stage of interview. ' +
                    'In the event that you do meet the requirements in the interview stage, your CV/resume ' +
                    'would be kept in view against other future opportunities.</p> \
                        <p>We wish you good luck.</p> \
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'
            }

            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendFailedShortlistMail: function(recipient_full_name, recipient_email, job_name) {
        try {
            var mailOptions = {
                from: config.from, // sender address
                to: recipient_email, // list of receivers
                subject: 'Job Application Status.',
                text: 'Failed Shortlist',
                html: '<p>Dear ' + recipient_full_name + ',</p>\
                        <p>We appreciate your interest and the time you’ve invested in applying for ' +
                    'the <b>' + job_name + '</b> opening.</p> \
                        <p>We ended up moving forward with another candidate, but we’d like to thank you ' +
                    'for giving us the opportunity to learn about your skills and accomplishments.</p> \
                        <p>GetaJobNG will continuously be advertising more job openings. We hope you’ll keep ' +
                    'us in mind and we encourage you to apply again.</p> \
                        <p>Please note that your CV/resume would be kept in view against other future opportunities.</p> \
                        <p>We wish you good luck with your job search and professional future endeavors.</p> \
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'
            }

            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendFailedShortlistDueToIncompleteDataMail: function(recipient_full_name, recipient_email, job_name, shortlist_param) {
        try {
            var mailOptions = {
                from: config.from, // sender address
                to: recipient_email, // list of receivers
                subject: 'Job Application Status.',
                text: 'Failed Shortlist',
                html: '<p>Dear ' + recipient_full_name + ',</p>\
                        <p>We appreciate your interest and the time you’ve invested in applying for ' +
                    'the <b>' + job_name + '</b> opening.</p> \
                        <p>We had to fail your application because your ' + shortlist_param + ' information is missing.</p> \
                        <p>Please update that information in the Settings or CV/Resume menu of your dashboard.</p> \
                        <p>We wish you good luck with your job search and professional future endeavors.</p> \
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'
            }

            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendTeamInviteMail: function(req, recipient_email, sender_full_name, company_name, role_name) {
        try {
            //Generate Invite Token
            var token = helpers.generateInviteToken();

            //Save Invite token to user record
            var user = new User();
            db.query(user.saveInviteToken(recipient_email, token), (err, data) => {
                //Nothing done here
                if (!err) {
                    logger.log("User Token saved!");
                }
            });

            //var pre_link = 'https://' + req.get('host');
            var link = 'https://getajobng.com/invites/' + token;
            //var fullLink = pre_link + link;

            var mailOptions = {
                from: config.from, // sender address
                to: recipient_email, // list of receivers
                subject: 'Invitation to join your company team on GetaJobNG',
                text: 'Welcome',
                html: '<p>Hello,</p>\
                        <p>You have been invited by ' + sender_full_name + ' to join the ' + company_name + ' team \
                        as a ' + role_name + '.<br> \
                        Please click on the link below to accept:<br> \
                        <a href="' + link + '">Accept Invitation</a></p> \
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'

            }

            //sendgridMailTransport.sendMail(mailOptions);
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }

    },

    sendJobPostedMail: function(req, recipient_email, recipient_full_name, job_id, job_title) {
        try {
            //var pre_link = 'https://' + req.get('host');
            var link = 'https://getajobng.com/job-detail/' + job_id;
            //var fullLink = pre_link + link;

            var mailOptions = {
                from: config.from, // sender address
                to: recipient_email, // list of receivers
                subject: 'Job Posted',
                text: 'Job Posted',
                html: '<p>Dear ' + recipient_full_name + ',</p>\
                        <p>Your job post titled <b>"' + job_title + '"</b> has been posted successfully.<br> \
                        Please click on the link below to view<br> \
                        <a href="' + link + '">View Job Post</a></p> \
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'

            }

            //sendgridMailTransport.sendMail(mailOptions);
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendCreateInterviewMail: function(req, recipient_full_name, recipient_email, interview_id,
        interview_name, interview_date, interview_time) {

        try {
            //var pre_link = 'https://' + req.get('host');
            var link = 'https://getajobng.com/interviews/interview-detail/' + interview_id;
            //var fullLink = pre_link + link;

            var mailOptions = {
                from: config.from, // sender address
                to: recipient_email, // list of receivers
                subject: 'Interview Created',
                text: 'Interview Created',
                html: '<p>Dear ' + recipient_full_name + ',</p>\
                        <p>You recently created an interview. Here are the details:</p> \
                        <br> \
                        <b>Name of Interview:</b> ' + interview_name + '<br> \
                        <b>Date:</b> ' + interview_date + '<br> \
                        <b>Time:</b> ' + interview_time + '<br> \
                        Please click on the link below to view more details <br> \
                        <a href="' + link + '">View Interview</a></p> \
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'

            }

            //sendgridMailTransport.sendMail(mailOptions);
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendUpdateInterviewMail: function(req, recipient_full_name, recipient_email, interview_id,
        interview_name, interview_date, interview_time) {

        try {
            //var pre_link = 'https://' + req.get('host');
            var link = 'https://getajobng.com/interviews/interview-detail/' + interview_id;
            //var fullLink = pre_link + link;

            var mailOptions = {
                from: config.from, // sender address
                to: recipient_email, // list of receivers
                subject: 'Interview Updated',
                text: 'Interview Updated',
                html: '<p>Dear ' + recipient_full_name + ',</p>\
                        <p>You recently updated an interview. Here are the details:</p> \
                        <br> \
                        <b>Name of Interview:</b> ' + interview_name + '<br> \
                        <b>Date:</b> ' + interview_date + '<br> \
                        <b>Time:</b> ' + interview_time + '<br> \
                        Please click on the link below to view more details <br> \
                        <a href="' + link + '">View Interview</a></p> \
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'

            }

            //sendgridMailTransport.sendMail(mailOptions);
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendPhysicalInterviewMailToCandidate: function(recipient_full_name, recipient_email, job_name, interview_name, interview_date, interview_time, venue) {
        try {
            var mailOptions = {
                from: config.from, // sender address
                to: recipient_email, // list of receivers
                subject: 'Job Interview Scheduled',
                text: 'Job Interview Scheduled',
                html: '<p>Dear ' + recipient_full_name + ',</p>\
                        <p>We received your application for the ' + job_name + ' position and are \
                        interested in discussing your qualifications further. We would like to invite you for a Physical \
                        Interview to discuss the job requirements and learn more about you. Information about the interview is below: </p> \
                        <br> \
                        <b>Name of Interview:</b> ' + interview_name + '<br> \
                        <b>Date:</b> ' + interview_date + '<br> \
                        <b>Time:</b> ' + interview_time + '<br> \
                        <b>Interview Type:</b> ' + venue + '<br> \
                        <p>At this interview you will be meeting with the Recruitment Officer. \
                        We expect the interview to last between 10 - 20 minutes. Feel free to ask any \
                        questions you may have about our hiring process, the position, or our company. \
                        Please come with your CV/resume and other documents requested by the recruiter such as an ID, a portfolio, or an assignment.</p> \
                        <p>We are looking forward to discussing this position with you.</p> \
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'

            }

            //sendgridMailTransport.sendMail(mailOptions);
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendVirtualInterviewMailToCandidate: function(recipient_full_name, recipient_email, job_name, interview_name, interview_date,
        interview_time, venue, link_to_virtual_meeting) {
        try {
            var mailOptions = {
                from: config.from, // sender address
                to: recipient_email, // list of receivers
                subject: 'Job Interview Scheduled',
                text: 'Job Interview Scheduled',
                html: '<p>Dear ' + recipient_full_name + ',</p>\
                        <p>We received your application for the ' + job_name + ' position and are \
                        interested in discussing your qualifications further. We would like to invite you for a Virtual \
                        Interview to discuss the job requirements and learn more about you. Information about the interview is below: </p> \
                        <br> \
                        <b>Name of Interview:</b> ' + interview_name + '<br> \
                        <b>Date:</b> ' + interview_date + '<br> \
                        <b>Time:</b> ' + interview_time + '<br> \
                        <b>Interview Type:</b> ' + venue + '<br> \
                        <b>Virtual Meeting Link:</b> ' + link_to_virtual_meeting + '<br> \
                        <p>At this interview you will be meeting virtually with the Recruitment Officer. \
                        We expect the interview to last between 10 - 20 minutes. Feel free to ask any \
                        questions you may have about our hiring process, the position, or our company. \
                        Please make sure you have on your device, soft copies of your CV/resume and other \
                        documents requested by the recruiter such as an ID, a portfolio, or an assignment.</p> \
                        <p>We are looking forward to discussing this position with you.</p> \
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'

            }

            //sendgridMailTransport.sendMail(mailOptions);
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendForgotPasswordEmail: function(req, user_id, fullName, recipient_email) {
        try {
            var password_reset_token = crypto.randomBytes(10).toString('hex');

            //Save Password reset token to user record
            var resume = new Resume();
            db.query(resume.savePasswordResetToken(user_id, password_reset_token), (err, data) => {
                //Nothing done here
                if (!err) {
                    logger.log("User Password Reset Token saved!");
                }
            });

            //var pre_link = 'https://' + req.get('host');
            var link = 'https://getajobng.com/auth/verify-password-token/' + password_reset_token;
            // var fullLink = pre_link + link;

            var mailOptions = {
                from: config.from, // sender address
                to: recipient_email, // list of receivers
                subject: 'Instructions for changing your GetaJobNG password',
                text: 'Welcome',
                html: '<p>Hello <b>' + fullName + ',</b></p> \
                    <p>You recently requested to reset your password.</p> \
                    <p>To reset your password, please follow the link below:</p> \
                    <p><a href="' + link + '">Reset Password</a></p> \
                    <p>If you are not sure why you are receiving this message, you can report it to us by emailing info@getajobng.com.</p>\
                    <p>If you suspect someone may have unauthorised access to your account, we suggest you change your password as a precaution by visiting your Dashboard -> Settings -> Change Password.</p>\
                    <p>Best Regards,</p> \
                    <p>Mr. Jobs</p>'

            }

            //sendgridMailTransport.sendMail(mailOptions);
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }

    },

    sendWeeklyJobUpdatesMail: function(jobs, candidate) {
        try {
            var jobs_list_content = '';

            for (var i = 0; i < jobs.length; i++) {
                //var pre_link = req.protocol + '://' + req.get('host');
                var fullLink = 'https://getajobng.com/job-detail/' + jobs[i].job_id;
                //var fullLink = pre_link + link;

                jobs_list_content += '<tr> \
                                        <td> \
                                            <div class="site_row"> \
                                                <p style=""> \
                                                    <a style="text-decoration:none;color:#06942A;font-weight:bold;font-size:14px" href="' + fullLink + '">' +
                    jobs[i].job_name +
                    '</a>\
                                                </p>\
                                                <p><i>' + jobs[i].company_name + ', ' + jobs[i].state_name + '</i></p>\
                                            </div>\
                                            <div class="candidates_for_open_job">\
                                                <a style="text-decoration:none;color:#06942A;font-weight:bold;font-size:12px" href="' + fullLink + '"> \
                                                    View more \
                                                </a> \
                                            </div> \
                                            <hr>\
                                        </td>\
                                    </tr>';
            }

            var mailOptions = {
                from: config.from, // sender address
                to: candidate.email,
                subject: 'We have jobs for you',
                text: 'Recommended Jobs',
                html: '<p>Dear ' + candidate.full_name + ',</p>\
                        <br> \
                        <p>We\'ve found some awesome jobs for you. Check them out!</p> \
                        <p><b>Job Listings:</b></p> \
                        <table id="jobs_table"> \
                            <thead> \
                                <tr> \
                                    <th width="100%"></th> \
                                </tr> \
                            </thead> \
                            <tbody id="jobs_data">' +
                    jobs_list_content +
                    '</tbody>\
                        </table><br> \
                        <p><a style="text-decoration:none;color:#06942A;font-weight:bold;font-size:14px" \
                            href="getajobng.com/find-a-job" target="_blank">Click to view more Jobs</a></p> \
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'

            }

            logger.log('@@@@@ Sending WeeklyJob Updates Mail for candidate - ' + candidate.user_id + ' @@@@@');
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }

    },

    sendCVReviewConfirmationMailToCandidate: function(candidate, transaction) {
        try {
            var candidate_full_name = candidate.first_name + " " + candidate.last_name;

            var mailOptions = {
                from: config.from, // sender address
                to: candidate.email,
                subject: 'CV Review Confirmation',
                text: 'CV Review Confirmation',
                html: '<p>Dear ' + candidate_full_name + ',</p>\
                        <p>Your CV Fix request was successful and processing is underway.</p> \
                        <p><b>CV Review Details:</b></p> \
                        <ul> \
                        <li><b>Transaction Reference:</b> ' + transaction.transaction_code + '</li> \
                        <li><b>Plan Type:</b> ' + transaction.plan_name + '</li> \
                        <li><b>Status:</b> ' + transaction.status + '</li> \
                        <li><b>Turn-around Time:</b> ' + transaction.duration + '</li> \
                        </ul> \
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'

            }

            logger.log('@@@@@ Sending CV Review confirmation email to candidate - ' + candidate.user_id + ' @@@@@');
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }

    },

    sendCVSelfServiceConfirmationMailToCandidate: function(candidate, transaction_reference, amount) {
        try {
            var candidate_full_name = candidate.first_name + " " + candidate.last_name;

            var mailOptions = {
                from: config.from, // sender address
                to: candidate.email,
                subject: 'CV Self Service Confirmation',
                text: 'CV Self Service Confirmation',
                html: '<p>Dear ' + candidate_full_name + ',</p>\
                        <p>Your CV (Self Service) payment was successful. You should be directed to a page \
                        to download your generated CV.</p> \
                        <p><b>Your Transaction Details:</b></p> \
                        <ul> \
                        <li><b>Transaction Reference:</b> ' + transaction_reference + '</li> \
                        <li><b>Amount:</b> N' + amount + '</li> \
                        </ul> \
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'

            }

            logger.log('@@@@@ Sending CV self service confirmation email to candidate - ' + candidate.user_id + ' @@@@@');
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }

    },

    sendCVToReviewer: function(reviewer_name, reviewer_email, candidate, transaction, fileName, destinationFilePath) {
        try {
            var candidate_full_name = candidate.first_name + " " + candidate.last_name;

            var mailOptions = {
                from: config.from, // sender address
                to: reviewer_email,
                subject: 'CV Review',
                text: 'CV Review',
                attachments: [{
                    filename: fileName,
                    path: destinationFilePath,
                    cid: candidate.email
                }],
                html: '<p>Dear ' + reviewer_name + ',</p>\
                        <p>A candidate just requested for your CV review services. Below are the details.</p> \
                        <p><b>CV Review Details:</b></p> \
                        <ul> \
                        <li><b>Candidate\'s Name:</b> ' + candidate_full_name + '</li> \
                        <li><b>Candidate\'s Email:</b> ' + candidate.email + '</li> \
                        <li><b>Candidate\'s Phone Number:</b> ' + candidate.phone_number + '</li> \
                        <li><b>Plan Name:</b> ' + transaction.plan_name + '</li> \
                        </ul> \
                        <p>The candidate\'s CV/Resume is attached to this mail.</p> \
                        <p>You can contact the candidate via mail or phone using the information above.</p> \
                        <p><b>NOTE: Submission of edited CV/Resumes is via mail using the candidate\'s email above.</b></p> \
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'

            }

            logger.log('@@@@@ Sending email to cv reviewer - ' + reviewer_name + ' @@@@@');
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendCVSelfServicePurchaseNotificationToAdmin: function(reviewer_name, reviewer_email, candidate, transaction_reference, amount) {
        try {
            var candidate_full_name = candidate.first_name + " " + candidate.last_name;

            var mailOptions = {
                from: config.from, // sender address
                to: reviewer_email,
                subject: 'CV Self Service Purchase Notification',
                text: 'CV Self Service Purchase Notification',
                html: '<p>Dear ' + reviewer_name + ',</p>\
                        <p>A candidate just paid for the CV Self Service plan. Below are the details.</p> \
                        <p><b>CV Self Service Details:</b></p> \
                        <ul> \
                        <li><b>Candidate\'s Name:</b> ' + candidate_full_name + '</li> \
                        <li><b>Candidate\'s Email:</b> ' + candidate.email + '</li> \
                        <li><b>Candidate\'s Phone Number:</b> ' + candidate.phone_number + '</li> \
                        <li><b>Transaction Reference:</b> ' + transaction_reference + '</li> \
                        <li><b>Amount:</b> N' + amount + '</li> \
                        </ul> \
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'

            }

            logger.log('@@@@@ Sending self service purchase notification to admin - ' + reviewer_name + ' @@@@@');
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendSubscriptionPlanUgradeMail: function(recruiter, transaction, subDueDate, amount) {
        try {
            var recruiter_full_name = recruiter.first_name + " " + recruiter.last_name;

            var mailOptions = {
                from: config.from, // sender address
                to: recruiter.email,
                subject: 'Subscription Plan Upgrade',
                text: 'Subscription Plan Upgrade',
                html: '<p>Dear ' + recruiter_full_name + ',</p>\
                        <p>Your subscription plan upgrade was successful. More information about this upgrade is below:</p> \
                        <p><b>Upgrade Details:</b></p> \
                        <ul> \
                        <li><b>Plan Name:</b> ' + transaction.plan_name + '</li> \
                        <li><b>Amount:</b> ' + amount + '</li> \
                        <li><b>Transaction Code:</b> ' + transaction.transaction_code + '</li> \
                        <li><b>Subscription Due Date:</b> ' + subDueDate + '</li> \
                        </ul> \
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'

            }

            logger.log('@@@@@ Sending email to recruiter - ' + recruiter_full_name + ' @@@@@');
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendCreateAssessmentMail: function(recipient_full_name, recipient_email, assessment_name) {
        try {
            var mailOptions = {
                from: config.from, // sender address
                to: recipient_email, // list of receivers
                subject: 'Assessment Created',
                text: 'Assessment Created',
                html: '<p>Dear ' + recipient_full_name + ',</p>\
                        <p>You recently created an assessment titled <b>' + assessment_name + '</b>.</p> \
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'

            }

            //sendgridMailTransport.sendMail(mailOptions);
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendAssessmentMailToCandidate(applicant_full_name, applicant_email, assessment) {
        try {
            var link_to_assessment = 'https://getajobng.com/assessments/take-assessment/' + assessment.assessment_token;

            var mailOptions = {
                from: config.from, // sender address
                to: applicant_email, // list of receivers
                subject: 'You’ve been invited to take assessment!',
                text: 'You’ve been invited to take assessment!',
                html: '<p>Dear ' + applicant_full_name + ',</p>\
                        <p>Thanks for your application for the ' + assessment.job_name + ' position. </p>\
                        <p>We’d love to get to know you better and learn more about your preferences. \
                        We care about our team and every person joining us.</p> \
                        <p>Please take this quick assessment by clicking on the link below. It will help us get to know you a bit better. \
                        <br> \
                        <b>Name of Assessment:</b> ' + assessment.assessment_name + '<br> \
                        <b>Assessment Type:</b> ' + assessment.assessment_type_name + '<br> \
                        <b>Job Position:</b> ' + assessment.job_name + '<br> \
                        <b>Time Required:</b> ' + assessment.time + ' mins<br><br> \
                        <b>Link to Assessment:</b> ' + link_to_assessment + '<br> \
                        <p>We are looking forward to your success in this job position.</p> \
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'

            }

            //sendgridMailTransport.sendMail(mailOptions);
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendAssessmentMailToRecruiter(recruiter, assessment, candiates_count) {
        try {
            var link_to_assessment = 'https://getajobng.com/assessments/take-assessment/' + assessment.assessment_token;

            var recruiter_full_name = recruiter.first_name + ' ' + recruiter.last_name;

            var mailOptions = {
                from: config.from, // sender address
                to: recruiter.email, // list of receivers
                subject: 'Assessment Shared',
                text: 'Assessment Shared',
                html: '<p>Dear ' + recruiter_full_name + ',</p>\
                        <p>Your assessment titled <b>' + assessment.assessment_name + '</b> has been shared to ' +
                    candiates_count + ' candidates successfully.</p>\
                        <p>A mail containing the link to take the assessment was sent to all the candidates.</p> \
                        <p>The system will automatically mark and score the assesment based on the criteria you specified.</p> \
                        <p>The assessment details are below: \
                        <br> \
                        <b>Name of Assessment:</b> ' + assessment.assessment_name + '<br> \
                        <b>Assessment Type:</b> ' + assessment.assessment_type_name + '<br> \
                        <b>Job Position:</b> ' + assessment.job_name + '<br> \
                        <b>Time Required:</b> ' + assessment.time + ' mins<br><br> \
                        <b>Link to Assessment:</b> ' + link_to_assessment + '<br> \
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'

            }

            //sendgridMailTransport.sendMail(mailOptions);
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendAssessmentSubmissionMailToCandidate(candidate_full_name, candidate_email, job_name) {
        try {
            var mailOptions = {
                from: config.from, // sender address
                to: candidate_email, // list of receivers
                subject: 'Assessment Completed',
                text: 'Assessment Completed',
                html: '<p>Dear ' + candidate_full_name + ',</p>\
                        <p>Thank you for completing the ' + job_name + ' assessment.</p>\
                        <p>The recruitment team will review and evaluate your answers. \
                            After that, we will get back to you with detailed feedback \
                            and any further information on next steps.</p> \
                        <p>Enjoy the rest of your day, and please don\'t hesitate to ask any questions you may have!</p> \
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'

            }

            //sendgridMailTransport.sendMail(mailOptions);
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendAssessmentSubmissionMailToRecruiter(recruiter_full_name, recruiter_email, candidate_full_name, job_name, assessment_name) {
        try {
            var mailOptions = {
                from: config.from, // sender address
                to: recruiter_email, // list of receivers
                subject: 'Assessment Submission Notification',
                text: 'Assessment Submission Notification',
                html: '<p>Dear ' + recruiter_full_name + ',</p>\
                        <p>A candidate (' + candidate_full_name + ') who is shorlisted for the ' + job_name + ' position \
                        has completed the ' + assessment_name + ' assessment.</p>\
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'

            }

            //sendgridMailTransport.sendMail(mailOptions);
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendRecruiterAccountApprovalMail(recruiter_full_name, recruiter_email, personal_message) {
        try {
            var mailOptions = {
                from: config.from, // sender address
                to: recruiter_email, // list of receivers
                subject: 'Account Approval',
                text: 'Account Approval',
                html: '<p>Dear ' + recruiter_full_name + ',</p>\
                        <p>Congratulations! We have looked at your account and KYC documents and granted you access to your GetaJobNG account.</p>\
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'

            }

            //sendgridMailTransport.sendMail(mailOptions);
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendRecruiterAccountDisapprovalMail(recruiter_full_name, recruiter_email, personal_message) {
        try {
            var mailOptions = {
                from: config.from, // sender address
                to: recruiter_email, // list of receivers
                subject: 'Account Disapproval',
                text: 'Account Disapproval',
                html: '<p>Dear ' + recruiter_full_name + ',</p>\
                        <p>We have looked at your account and KYC documents and had to disapprove access to your GetaJobNG account. The reason for this is below:</p>\
                        <p>' + personal_message + '</p>\
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'

            }

            //sendgridMailTransport.sendMail(mailOptions);
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendJobApprovalMailToRecruiter(recruiter_full_name, recruiter_email, job_id, job_name) {
        try {
            var link = 'https://getajobng.com/job-detail/' + job_id;

            var mailOptions = {
                from: config.from, // sender address
                to: recruiter_email, // list of receivers
                subject: 'Job Post Approved',
                text: 'Job Post Approved',
                html: '<p>Dear ' + recruiter_full_name + ',</p>\
                        <p>Congratulations! Your job ad (' + job_name + ') has been approved and is now active or live.</p>\
                        <p>The link to the job ad is below:</p>\
                        <p><a href="' + link + '">View Job Post</a></p> \
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'

            }

            //sendgridMailTransport.sendMail(mailOptions);
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendJobApprovalMailToAdmin(admin_full_name, admin_email, job_id, job_name) {
        try {
            var link = 'https://getajobng.com/job-detail/' + job_id;

            var mailOptions = {
                from: config.from, // sender address
                to: admin_email, // list of receivers
                subject: 'Job Post Approved',
                text: 'Job Post Approved',
                html: '<p>Dear ' + admin_full_name + ',</p>\
                        <p>Congratulations! The job ad (' + job_name + ') has been approved and is now active or live.</p>\
                        <p>The link to the job ad is below:</p>\
                        <p><a href="' + link + '">View Job Post</a></p> \
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'

            }

            //sendgridMailTransport.sendMail(mailOptions);
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendJobDisapprovalMailToRecruiter(recruiter_full_name, recruiter_email, job_name) {
        try {
            var mailOptions = {
                from: config.from, // sender address
                to: recruiter_email, // list of receivers
                subject: 'Job Post Disapproved',
                text: 'Job Post Disapproved',
                html: '<p>Dear ' + recruiter_full_name + ',</p>\
                        <p>Your job ad (' + job_name + ') has been disapproved and is no more live on the GetaJobNG site.</p>\
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'

            }

            //sendgridMailTransport.sendMail(mailOptions);
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    },

    sendJobDisapprovalMailToAdmin(admin_full_name, admin_email, job_name) {
        try {
            var mailOptions = {
                from: config.from, // sender address
                to: admin_email, // list of receivers
                subject: 'Job Post Disapproved',
                text: 'Job Post Disapproved',
                html: '<p>Dear ' + admin_full_name + ',</p>\
                        <p>The job ad (' + job_name + ') has been disapproved and is no more live on the GetaJobNG site.</p>\
                        <p>Best Regards,</p> \
                        <p>Mr. Jobs</p>'

            }

            //sendgridMailTransport.sendMail(mailOptions);
            mailTransport.sendMail(mailOptions);
        } catch (error) {
            logger.log(error);
        }
    }
}

module.exports = mailFunctions;