var crypto = require('crypto');
var db = require('./../db/database');
var dateTime = require('node-datetime');
var config = require('./config');
var logger = require('./log4js');
var sessionStore = require('../config/session_store');
var moment = require('moment');
var fs = require('fs');
var User = require('../models/user');
var https = require('https');
var http = require('http');
var path = require('path');
var querystring = require('querystring');
var appRoot = require('app-root-path');
var AzureHelper = require('./azure_helpers');
var Resume = require('../models/resume');
var request = require('request');

var helpers = {
    generateActivationToken: function () {
        try {
            return crypto.randomBytes(64).toString('hex');
        } catch (error) {
            logger.log(error);
        }
    },

    generateInviteToken: function () {
        try {
            return crypto.randomBytes(10).toString('hex');
        } catch (error) {
            logger.log(error);
        }
    },

    generatePasswordResetToken: function () {
        try {
            return crypto.randomBytes(10).toString('hex');
        } catch (error) {
            logger.log(error);
        }
    },

    generateToken10: function () {
        try {
            return crypto.randomBytes(10).toString('hex');
        } catch (error) {
            logger.log(error);
        }
    },

    stringifyArray: function (array) {
        try {
            return JSON.stringify(array);
        } catch (error) {
            logger.log(error);
        }
    },

    parseJSONToArray: function (json) {
        try {
            return JSON.parse(json);
        } catch (error) {
            logger.log(error);
        }
    },

    getUsersActivityTrail: function (user_id) {
        try {
            var sql = `SELECT * FROM activity_trail WHERE user_id = ${user_id}`;

            db.query(sql, (err, data) => {
                if (err) {
                    logger.log(err);
                } else {
                    logger.log(data);
                }
            });
        } catch (error) {
            logger.log(error);
        }
    },

    saveActivityTrail: function (user_id, title, description) {
        try {
            var date_created = this.getCurrentTimeStamp();

            var sql = `INSERT INTO activity_trail(title, description, user_id, date_created) VALUES \
                        ('${title}', '${description}', ${user_id}, '${date_created}')`;

            db.query(sql, (err, data) => {
                if (err) {
                    logger.log(err);
                } else {
                    logger.log("Activity_trail saved.")
                }
            });
        } catch (error) {
            logger.log(error);
        }
    },

    checkifUndefined: function (value) {
        try {
            if (typeof value === 'undefined') {
                return null;
            } else {
                return value;
            }
        } catch (error) {
            logger.log(error);
        }
    },

    getCurrentTimeStamp: function () {
        try {
            var dt = dateTime.create();
            var date_created = dt.format('Y-m-d H:M:S');

            return date_created;
        } catch (error) {
            logger.log(error);
        }
    },

    getSubscriptionDueDate: function (date) {
        try {
            var dt = dateTime.create(date);
            dt.offsetInDays(config.subscription_interval);
            var date_created = dt.format('Y-m-d H:M:S');

            return date_created;
        } catch (error) {
            logger.log(error);
        }
    },

    convertDateTimeToMilliseconds: function (dateTime) {
        try {
            var date = new Date(dateTime);

            return date.getTime();
        } catch (error) {
            logger.log(error);
        }
    },

    showNotifyAlert: function () {

    },

    getCurrentTimeAgo: function (dateTime) {
        try {
            return moment(dateTime).fromNow();
        } catch (error) {
            logger.log(error);
        }
    },

    formatDateTime: function (dateTime) {
        try {
            return moment(dateTime).format('ll');
            //return moment(dateTime).format('MMM DD, YYYY');
        } catch (error) {
            logger.log(error);
        }
    },

    getDateofDayofTheWeek: function (day) {
        try {
            return moment(moment().day(day)._d).format('YYYY-MM-DD');
        } catch (error) {
            logger.log(error);
        }
    },

    validateCandidateRegistration: function (first_name, last_name, email, phone_number, password, retype_password) {
        try {
            var firstNameErr = lastNameErr = emailErr = phoneErr = passwordErr = true;

            // Validate first name
            if (first_name == "") {
                //printError("firstNameErr", "Please enter your First Name");
            } else {
                var regex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
                if (regex.test(first_name) === false) {
                    //printError("firstNameErr", "Please enter a valid name");
                } else {
                    // printError("firstNameErr", "");
                    firstNameErr = false;
                }
            }

            // Validate last name
            if (last_name == "") {
                //printError("lastNameErr", "Please enter your Last Name");
            } else {
                var regex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
                if (regex.test(last_name) === false) {
                    //printError("lastNameErr", "Please enter a valid name");
                } else {
                    //printError("lastNameErr", "");
                    lastNameErr = false;
                }
            }

            // Validate email address
            if (email == "") {
                //printError("emailErr", "Please enter your email address");
            } else {
                // Regular expression for basic email validation
                var regex = /^\S+@\S+\.\S+$/;
                if (regex.test(email) === false) {
                    //printError("emailErr", "Please enter a valid email address");
                } else {
                    //printError("emailErr", "");
                    emailErr = false;
                }
            }

            // Validate phone number
            if (phone_number == "") {
                //printError("phoneErr", "Please enter your Phone Number");
            } else {
                var regex = /^[0-9]\d{10}$/;
                if (regex.test(phone_number) === false) {
                    //printError("phoneErr", "Please enter a valid 11 digit phone number");
                } else {
                    //printError("phoneErr", "");
                    phoneErr = false;
                }
            }

            // Validate password
            if (password == "") {
                //printError("passwordErr", "Please enter a password");
            } else {
                var regex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
                if (regex.test(password) === false) {
                    // printError("passwordErr", "Please enter a valid password. Password length must be at least 6 characters. Must contain at least 1 lowercase, 1 uppercase and 1 number");

                } else if (password != retype_password) {
                    //printError("passwordErr", "Password Mismatch");

                } else {
                    //printError("passwordErr", "");
                    passwordErr = false;
                }
            }

            // Prevent the form from being submitted if there are any errors
            if ((firstNameErr || lastNameErr || emailErr || phoneErr || passwordErr) == true) {
                return false;
            } else {
                return true;
            }

        } catch (error) {
            logger.log(error);
        }
    },

    validateRecruiterRegistration: function (recruiter_class, first_name, last_name, email, phone_number, company_name,
        industry, password, retype_password, rc_number, cert_of_incorp) {

        try {
            if (recruiter_class == 'individual') {
                // Defining error variables with a default value
                var firstNameErr = lastNameErr = emailErr = phoneErr = passwordErr = true;

                // Validate first name
                if (first_name == "") {
                    //printError("firstNameErr", "Please enter your First Name");
                } else {
                    var regex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
                    if (regex.test(first_name) === false) {
                        //printError("firstNameErr", "Please enter a valid name");
                    } else {
                        //printError("firstNameErr", "");
                        firstNameErr = false;
                    }
                }

                // Validate last name
                if (last_name == "") {
                    //printError("lastNameErr", "Please enter your Last Name");
                } else {
                    var regex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
                    if (regex.test(last_name) === false) {
                        //printError("lastNameErr", "Please enter a valid name");
                    } else {
                        //printError("lastNameErr", "");
                        lastNameErr = false;
                    }
                }

                // Validate email address
                if (email == "") {
                    //printError("emailErr", "Please enter your email address");
                } else {
                    // Regular expression for basic email validation
                    var regex = /^\S+@\S+\.\S+$/;
                    if (regex.test(email) === false) {
                        //printError("emailErr", "Please enter a valid email address");
                    } else {
                        //printError("emailErr", "");
                        emailErr = false;
                    }
                }

                // Validate phone number
                if (phone_number == "") {
                    //printError("phoneErr", "Please enter your Phone Number");
                } else {
                    var regex = /^[0-9]\d{10}$/;
                    if (regex.test(phone_number) === false) {
                        //printError("phoneErr", "Please enter a valid 11 digit phone number");
                    } else {
                        //printError("phoneErr", "");
                        phoneErr = false;
                    }
                }

                // Validate password
                if (password == "") {
                    //printError("passwordErr", "Please enter a password");
                } else {
                    var regex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
                    if (regex.test(password) === false) {
                        //printError("passwordErr", "Please enter a valid password. Password length must be at least 6 characters. Must contain at least 1 lowercase, 1 uppercase and 1 number");

                    } else if (password != retype_password) {
                        //printError("passwordErr", "Password Mismatch");

                    } else {
                        //printError("passwordErr", "");
                        passwordErr = false;
                    }
                }

                // Prevent the form from being submitted if there are any errors
                if ((firstNameErr || lastNameErr || emailErr || phoneErr || passwordErr) == true) {
                    return false;
                } else {
                    return true;
                }

            } else if (recruiter_class == 'corporate') {
                // Defining error variables with a default value
                var firstNameErr = lastNameErr = emailErr = phoneErr = passwordErr =
                    companyNameErr = industryErr = certOfIncorpErr = true;

                // Validate company name
                if (company_name == "") {
                    //printError("companyNameErr", "Please enter your Company Name");
                } else {
                    var regex = /^[a-zA-Z\s]+$/;
                    if (regex.test(company_name) === false) {
                        //printError("companyNameErr", "Please enter a valid Company Name");
                    } else {
                        //printError("companyNameErr", "");
                        companyNameErr = false;
                    }
                }

                // Validate certificate of incorporation
                if (cert_of_incorp == "") {
                    //printError("certOfIncorpErr", "Please upload your Certificate of Incorporation");
                } else {
                    //printError("certOfIncorpErr", "");
                    certOfIncorpErr = false;
                }

                // Validate first name
                if (first_name == "") {
                    //printError("firstNameErr", "Please enter your First Name");
                } else {
                    var regex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
                    if (regex.test(first_name) === false) {
                        //printError("firstNameErr", "Please enter a valid name");
                    } else {
                        //printError("firstNameErr", "");
                        firstNameErr = false;
                    }
                }

                // Validate last name
                if (last_name == "") {
                    //printError("lastNameErr", "Please enter your Last Name");
                } else {
                    //var regex = /^[a-zA-Z\s]+$/;
                    var regex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
                    if (regex.test(last_name) === false) {
                        //printError("lastNameErr", "Please enter a valid name");
                    } else {
                        //printError("lastNameErr", "");
                        lastNameErr = false;
                    }
                }

                // Validate email address
                if (email == "") {
                    //printError("emailErr", "Please enter your email address");
                } else {
                    // Regular expression for basic email validation
                    var regex = /^\S+@\S+\.\S+$/;
                    if (regex.test(email) === false) {
                        //printError("emailErr", "Please enter a valid email address");
                    } else {
                        // printError("emailErr", "");
                        emailErr = false;
                    }
                }

                // Validate phone number
                if (phone_number == "") {
                    //printError("phoneErr", "Please enter your Phone Number");
                } else {
                    var regex = /^[0-9]\d{10}$/;
                    if (regex.test(phone_number) === false) {
                        //printError("phoneErr", "Please enter a valid 11 digit phone number");
                    } else {
                        //printError("phoneErr", "");
                        phoneErr = false;
                    }
                }

                // Validate password
                if (password == "") {
                    // printError("passwordErr", "Please enter a password");
                } else {
                    var regex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
                    if (regex.test(password) === false) {
                        //printError("passwordErr", "Please enter a valid password. Password length must be at least 6 characters. Must contain at least 1 lowercase, 1 uppercase and 1 number");

                    } else if (password != retype_password) {
                        //printError("passwordErr", "Password Mismatch");

                    } else {
                        //printError("passwordErr", "");
                        passwordErr = false;
                    }
                }

                // Validate industry
                if (industry == "0") {
                    //printError("industryErr", "Please select your company's industry");
                } else {
                    //printError("industryErr", "");
                    industryErr = false;
                }


                // Prevent the form from being submitted if there are any errors
                if ((firstNameErr || lastNameErr || emailErr || phoneErr || companyNameErr ||
                    industryErr || passwordErr || certOfIncorpErr) == true) {
                    return false;
                } else {
                    return true;
                }
            }
        } catch (error) {
            logger.log(error);
        }
    },

    validateCaptcha: function (req, captcha_response) {
        try {
            if (captcha_response === undefined || captcha_response === '' || captcha_response === null) {
                //return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
                return false;
            }
            // Put your secret key here.
            var secretKey = "6Le47JIaAAAAAAOaaRC_-9V5cKs7uFvPQkXaLvJo";

            var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + captcha_response + "&remoteip=" + req.connection.remoteAddress;
            console.log('verificationUrl - ' + verificationUrl)


            request(verificationUrl, function (error, response, body) {
                console.log(body)
                body = JSON.parse(body);
                console.log(body)
                // Success will be true or false depending upon captcha validation.
                if (body.success !== undefined && !body.success) {
                    //return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
                    return false;
                }
                //res.json({"responseCode" : 0,"responseDesc" : "Sucess"});
                return true;
            });
        } catch (error) {
            logger.log(error);
        }
    },

    formatDateToDatetime: function (date) {
        try {
            return moment(date).format('YYYY-MM-DD HH:mm:ss');
        } catch (error) {
            logger.log(error);
        }
    },

    checkIfDirectoryExist: function (dir) {
        try {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        } catch (error) {
            logger.log(error);
        }
    },

    calculateProfilePercentage: function (user_id, userData, resumeInfo, resumeEducation, resumeWorkExperience,
        resumeCertification, resumeSkill) {

        try {
            var profile_score = 0;

            var resume = new Resume();
            db.query(resume.getProfilePercentageSettings(), (err, data) => {
                if (err) { logger.log(err) } else {
                    var allParams = {};
                    var total_param_score = 0;

                    //Organize data
                    for (var i = 0; i < data.length; i++) {
                        allParams[data[i].setting_name] = parseInt(data[i].value);
                        total_param_score += parseInt(data[i].value);
                    }

                    //Checks
                    if (typeof userData && resumeInfo && resumeEducation && resumeWorkExperience &&
                        resumeCertification == 'undefined') {

                        profile_score = 0;
                    } else {
                        if (typeof userData.first_name != 'undefined' && userData.first_name && userData.first_name != '') {
                            profile_score += allParams.pp_first_name;
                        }

                        if (typeof userData.last_name != 'undefined' && userData.last_name && userData.last_name != '') {
                            profile_score += allParams.pp_last_name;
                        }

                        if (typeof userData.email != 'undefined' && userData.email && userData.email != '') {
                            profile_score += allParams.pp_email;
                        }

                        if (typeof userData.phone_number != 'undefined' && userData.phone_number && userData.phone_number != '') {
                            profile_score += allParams.pp_phone_number;
                        }

                        if (typeof userData.profile_picture != 'undefined' && userData.profile_picture && userData.profile_picture != '') {
                            profile_score += allParams.pp_profile_picture;
                        }

                        if (typeof resumeInfo.resume_file_url != 'undefined' && resumeInfo.resume_file_url && resumeInfo.resume_file_url != '') {
                            profile_score += allParams.pp_cv_upload;
                        }

                        if (typeof resumeInfo.profile_summary != 'undefined' && resumeInfo.profile_summary && resumeInfo.profile_summary != '') {
                            profile_score += allParams.pp_summary;
                        }

                        if (typeof resumeEducation != 'undefined' && resumeEducation && resumeEducation.length > 0) {
                            profile_score += allParams.pp_education;
                        }

                        if (typeof resumeWorkExperience != 'undefined' && resumeWorkExperience && resumeWorkExperience.length > 0) {
                            profile_score += allParams.pp_work_experience;
                        }

                        if (typeof resumeCertification != 'undefined' && resumeCertification && resumeCertification.length > 0) {
                            profile_score += allParams.pp_certificates;
                        }

                        if (typeof resumeSkill != 'undefined' && resumeSkill && resumeSkill.length > 0) {
                            profile_score += allParams.pp_skills;
                        }

                        if (typeof userData.address != 'undefined' && userData.address && userData.address != '') {
                            profile_score += allParams.pp_address;
                        }

                        if (typeof userData.state != 'undefined' && userData.state && userData.state != '') {
                            profile_score += allParams.pp_state;
                        }

                        if (typeof userData.country != 'undefined' && userData.country && userData.country != '') {
                            profile_score += allParams.pp_country;
                        }

                        if (typeof userData.gender != 'undefined' && userData.gender && userData.gender != '') {
                            profile_score += allParams.pp_gender;
                        }

                        if (typeof userData.tagline != 'undefined' && userData.tagline && userData.tagline != '') {
                            profile_score += allParams.pp_tagline;
                        }
                    }

                    logger.log('profile_score - ' + profile_score)
                    logger.log('total_param_score - ' + total_param_score)

                    var profile_percentage = Math.round((profile_score / total_param_score) * 100);
                    logger.log('profile_percentage - ' + profile_percentage);

                    db.query(resume.saveProfilePercentage(user_id, profile_percentage), (err, data) => {
                        if (err) { logger.log(err) } else {
                            logger.log('profile_percentage saved')
                        }
                    });
                }
            });
        } catch (error) {
            logger.log(error);
        }
    },

    sortRecommendedJobsArray: function (unsortedArray) {
        try {
            var sortedArray = unsortedArray.concat();

            for (var i = 0; i < sortedArray.length; ++i) {
                for (var j = i + 1; j < sortedArray.length; ++j) {
                    if (sortedArray[i].job_id === sortedArray[j].job_id) {
                        sortedArray.splice(j--, 1);
                    }
                }
            }

            return sortedArray;
        } catch (error) {
            logger.log(error);
        }
    },

    sortUsersArray: function (unsortedArray) {
        try {
            var sortedArray = unsortedArray.concat();

            for (var i = 0; i < sortedArray.length; ++i) {
                for (var j = i + 1; j < sortedArray.length; ++j) {
                    if (sortedArray[i].user_id === sortedArray[j].user_id) {
                        sortedArray.splice(j--, 1);
                    }
                }
            }

            return sortedArray;
        } catch (error) {
            logger.log(error);
        }
    },

    runPostRequestToLogin: function (hostlink, path, email, password) {
        try {
            logger.log('hostlink - ' + hostlink);

            var params = {
                username: email,
                password: password
            }

            var post_data = querystring.stringify(params);

            var options = {
                url: hostlink,
                path: path,
                port: config.port,
                method: 'POST'
            }

            var request = http.request(options, (response) => {

            });

            request.write(post_data);
            request.end();
        } catch (error) {
            logger.log(error);
        }
    },

    checkifAuthenticated: async (req, res) => {
        try {
            const session = await req.session.passport;
            logger.log("this is the session" + session.user_id);
            if (!session) {
                logger.log("Main here - user is not authenticated..back to login");

                var go_to_login_file = `${appRoot}/views/go_to_login.html`;

                res.sendFile(go_to_login_file);

                return false;
            } else {
                logger.log("AM here user is already authenticated..proceed");

                return true;
            }
        } catch (error) {
            logger.log(error);
        }
    },

    unescapeHTML: function (escapedHTML) {
        try {
            return escapedHTML.replace(/''/g, "'").replace(/""/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, "&").replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&rsquo;/g, "'").replace(/(?:\r\n|\r|\n)/g, '');
        } catch (error) {
            logger.log(error);
        }
    },

    escapeString: function (val) {
        try {
            val = val.replace(/[\0\n\r\b\t\\'"\x1a]/g, function (s) {
                switch (s) {
                    case "\0":
                        return "\\0";
                    case "\n":
                        return "\\n";
                    case "\r":
                        return "\\r";
                    case "\b":
                        return "\\b";
                    case "\t":
                        return "\\t";
                    case "\x1a":
                        return "\\Z";
                    case "'":
                        return "''";
                    //return "'";
                    case '"':
                        return '""';
                    //return '"';
                    default:
                        return "\\" + s;
                }
            });

            return val;
        } catch (error) {
            logger.log(error);
        }
    },

    downloadFile: function (res, fileName) {
        try {
            logger.log("Downloading File");
            //var file = path.join(__dirname, '../assets' , fileName);
            var file = `${appRoot}/assets/uploads/docs/resumes/${fileName}`;

            res.download(file);
        } catch (error) {
            logger.log(error);
        }
    },

    downloadResumeFromAzure: function (res, fileName) {
        try {
            logger.log("Downloading File from Azure");

            var azureHelper = new AzureHelper();
            var promiseResult = azureHelper.downloadFromBlob(res, fileName);

            promiseResult
                .then(response => {
                    console.log(response)
                    return config.success;
                })
                .catch(error => {
                    console.log(error)
                    return config.failed;
                })

            //logger.log(res);
        } catch (error) {
            logger.log(error);
        }
    },

    downloadRecruiterKYCDocFromAzure: function (res, fileName) {
        try {
            logger.log("Downloading Recruiter KYC Doc from Azure");

            var azureHelper = new AzureHelper();
            var promiseResult = azureHelper.downloadRecruiterKYCDocFromBlob(res, fileName);

            promiseResult
                .then(response => {
                    console.log(response)
                    return config.success;
                })
                .catch(error => {
                    console.log(error)
                    return config.failed;
                })

            //logger.log(res);
        } catch (error) {
            logger.log(error);
        }
    },

    downloadResumeForCVReviewOld: function (res, userData, fileName, transaction) {
        try {
            logger.log("Downloading File from Azure");

            var sql = `SELECT setting_value FROM setting WHERE setting_name = "cv_reviewers"`;

            db.query(sql, (err, data) => {
                if (err) {
                    logger.log(err);
                } else {
                    var cv_reviewers = data[0].setting_value;

                    var index = this.getRandomNumber(0, 2);

                    var cv_reviewers_array = cv_reviewers.split(",");
                    var reviewer = cv_reviewers_array[index].split(";");

                    var azureHelper = new AzureHelper();
                    azureHelper.downloadCVAndSendMailsForReview(res, userData, fileName, transaction, reviewer);
                }
            });
        } catch (error) {
            logger.log(error);
        }
    },

    downloadResumeForCVReview: function (res, userData, fileName, transaction) {
        try {
            logger.log("Downloading File from Azure");

            var azureHelper = new AzureHelper();
            azureHelper.downloadCVAndSendMailsForReview(res, userData, fileName, transaction);

        } catch (error) {
            logger.log(error);
        }
    },

    getRandomNumber: function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    copyFile: function (file, dir2) {
        try {
            //gets file name and adds it to dir2
            var f = path.basename(file);
            var source = fs.createReadStream(file);
            var dest = fs.createWriteStream(path.resolve(dir2, f));

            source.pipe(dest);
            source.on('end', function () { logger.log('Succesfully copied'); });
            source.on('error', function (err) { logger.log(err); });
        } catch (error) {
            logger.log(error);
        }
    },

    checkApplicationDeadline: function (date) {
        try {
            var current_date = moment();
            var converted_date = moment(date);

            return converted_date < current_date ? 'Closed' : this.formatDateTime(date);
        } catch (error) {
            logger.log(error);
        }
    },

    formatToCurrency: function (amount) {
        try {
            var decimalCount = 2;
            var decimal = ".";
            var thousands = ",";

            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            var negativeSign = amount < 0 ? "-" : "";

            var i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
            var j = (i.length > 3) ? i.length % 3 : 0;

            return config.local_currency + negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } catch (error) {
            logger.log(error);
        }
    },

    getGrade(score, total_score, pass_percentage) {
        try {
            var score_percentage = (score / total_score) * 100;

            console.log('score_percentage - ' + score_percentage);
            if (score_percentage >= pass_percentage) {
                return config.passed;
            } else {
                return config.failed;
            }
        } catch (error) {
            logger.log(error);
        }
    }
}

module.exports = helpers;