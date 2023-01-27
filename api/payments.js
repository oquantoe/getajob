var express = require('express');
var db = require('../db/database');
var Payment = require('../models/payment');
var User = require('../models/user');
var helpers = require('../config/helpers');
var config = require('../config/config');
var logger = require('../config/log4js');
var mailer = require('../config/mail/mailer');
var paystack = require('paystack')(config.paystack_live_secret_key);

const router = express.Router();

router.post("/save-transaction-info", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var transaction_reference = req.body.trxref;
        var amount = req.body.amount;
        var payment_plan_id = req.body.payment_plan_id;
        var status = req.body.status;

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        var payment = new Payment();
        db.query(payment.savePaymentTransaction(transaction_reference, user_id, payment_plan_id,
            amount, status), (err, data) => {
            if (err) {
                logger.log(err);
            } else {

                processCVFix(req, transaction_reference);

                res.status(200).json({
                    message: "Payment Transaction Saved.",
                    transaction_id: data.insertId
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post("/make-payment", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var userData = req.session.passport.user;
        var email = userData.email;
        var name = userData.first_name + " " + userData.last_name;

        var payment_plan_id = req.body.payment_plan_id;

        var payment = new Payment();
        db.query(payment.getPaymentPlanDetails(payment_plan_id), (err, data) => {
            if (err) { logger.log(err); } else {

                var plan_details = data[0];

                // call paystack
                paystack.transaction.initialize({
                    amount: plan_details.amount * 100,
                    name: name,
                    email: email,
                    callback_url: config.prod_domain + "/payments/verify-transaction?pp=" + payment_plan_id
                }, function(error, body) {
                    if (!error) {
                        //logger.log(body);
                        res.status(200).json({
                            result: body
                        });

                    } else {
                        //logger.log(error);
                        res.status(200).json({
                            result: error
                        });
                    }
                });
            }
        });

    } catch (error) {
        logger.log(error);
    }

});

router.get("/verify-transaction", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var trxRef = req.query.reference;
        var payment_plan_id = req.query.pp;

        logger.log('Verifying Transaction');

        paystack.transaction.verify(trxRef, function(error, body) {
            if (!error) {
                //logger.log(body);
                if (body.status == true) {
                    var amount = body.data.amount / 100;
                    var status = body.data.status;
                    var ipAddress = body.data.ip_address;
                    var channel = body.data.channel;

                    savePaymentTransaction(req, res, trxRef, payment_plan_id, amount, status, ipAddress, channel);
                } else {
                    logger.log("Transaction not verified");
                    res.redirect('/candidates/cv-payment-notification');
                }
            } else {
                logger.log(error);
            }
        });

    } catch (error) {
        logger.log(error);
    }
});

function savePaymentTransaction(req, res, transaction_reference, payment_plan_id, amount, status, ipAddress, channel) {
    try {
        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        transaction_reference = config.transaction_reference_prefix + transaction_reference.toUpperCase();

        logger.log('Saving Transaction Details');
        var payment = new Payment();
        db.query(payment.savePaymentTransaction(transaction_reference, user_id, payment_plan_id,
            amount, status, ipAddress, channel), (err, data) => {

            if (err) {
                logger.log(err);
            } else {
                db.query(payment.getPaymentPlanDetails(payment_plan_id), (err, data) => {
                    if (err) {
                        logger.log(err);
                    } else {
                        var plan_details = data[0];

                        if (plan_details.payment_plan_type == config.cv_review_plan) {
                            if (payment_plan_id == config.cv_self_service_plan) {
                                processCVSelfServicePlan(req, res, transaction_reference, amount);
                            } else {
                                processCVFix(req, res, transaction_reference);
                            }

                        } else if (plan_details.payment_plan_type == config.subscription_plan) {
                            processSubscriptionChange(req, res, transaction_reference);
                        }


                    }
                });


            }
        });

    } catch (error) {
        logger.log(error);
    }
}

function processCVFix(req, res, transaction_reference) {
    try {
        logger.log('Processing CV Fix');

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        var user = new User();
        db.query(user.getCandidateCV(user_id), (err, data) => {
            if (err) {
                logger.log(err);
            } else {
                var candidate_resume_url =
                    typeof data[0].resume_file_url != 'undefined' && data[0].resume_file_url &&
                    data[0].resume_file_url != '' && data[0].resume_file_url != null ?
                    data[0].resume_file_url : 'false';

                var payment = new Payment();
                db.query(payment.getTransactionDetails(transaction_reference, user_id), (err, data) => {
                    if (err) { logger.log(err) } else {
                        var transaction = data[0];

                        if (candidate_resume_url !== 'false') {
                            helpers.saveActivityTrail(user_id, "CV Fix", "You submitted your CV/Resume for a fix.");

                            helpers.downloadResumeForCVReview(res, userData, candidate_resume_url, transaction);
                        } else {
                            res.status(200).json({
                                message: 'CV/Resume not Downloaded',
                                isDownloaded: false
                            });
                        }
                    }
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
}

function processSubscriptionChange(req, res, transaction_reference) {
    try {
        logger.log('Processing Subscription Change');

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        var payment = new Payment();
        db.query(payment.getTransactionDetails(transaction_reference, user_id), (err, data) => {
            if (err) { logger.log(err) } else {
                var transaction = data[0];

                var plan_upgrade_date = helpers.getCurrentTimeStamp();
                var subscription_due_date = helpers.getSubscriptionDueDate(plan_upgrade_date);

                var user = new User();
                db.query(user.updateRecruiterSubscriptionPlanQuery(user_id, config.classic_plan, plan_upgrade_date,
                    subscription_due_date), (err, data) => {
                    if (!err) {
                        if (data && data.affectedRows > 0) {

                            helpers.saveActivityTrail(user_id, "Plan Upgrade", "You upgraded your plan to Classic.");

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
                                plan_type: config.classic_plan,
                                subscription_due_date: subscription_due_date
                            }

                            userData = req.session.passport.user;

                            console.log(userData)

                            var subDueDate = helpers.formatDateTime(transaction.subscription_due_date);
                            console.log('subDueDate - ' + subDueDate)

                            var amount = helpers.formatToCurrency(transaction.amount);
                            console.log('amount - ' + amount)


                            mailer.sendSubscriptionPlanUgradeMail(userData, transaction, subDueDate, amount);

                            res.redirect('/recruiters/dashboard?r=s&f=s_u');

                        } else {
                            res.redirect('/recruiters/dashboard?r=f&f=s_u');
                        }
                    }
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
}

function processCVSelfServicePlan(req, res, transaction_reference, amount) {
    try {
        logger.log('Processing CV Self Service');

        var userData = req.session.passport.user;
        var user_id = userData.user_id;

        //send mail
        mailer.sendCVSelfServiceConfirmationMailToCandidate(userData, transaction_reference, amount);

        var reviewer_name = 'GetaJobNG Team';
        var reviewer_email = 'cvfixrequests@c-ileasing.com';

        mailer.sendCVSelfServicePurchaseNotificationToAdmin(reviewer_name, reviewer_email, userData, transaction_reference, amount);

        res.redirect('/candidates/cv-preview?v=s&txf=' + transaction_reference);

    } catch (error) {
        logger.log(error);
    }
}


module.exports = router;