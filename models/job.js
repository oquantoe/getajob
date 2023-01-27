var dateTime = require('node-datetime');
var config = require('../config/config');
var db = require('../db/database');
var moment = require('moment');
var sessionStore = require('./../config/session_store');
var helper = require('./../config/helpers');
var logger = require('./../config/log4js');
var mailer = require('./../config/mail/mailer');

class Job {

    constructor() {}

    createJobQuery(job_title, company_id, default_country_id, job_type, job_category, location,
        industry, job_description, job_responsibilities, min_qualification, experience_level, min_year_of_experience,
        max_year_of_experience, expected_salary, gender_type, application_deadline, minimum_age, maximum_age,
        required_skills, shortlist_params, application_channel, external_application_link, user_id, is_approved, status) {

        job_title = helper.escapeString(job_title);
        job_title = this.checkifUndefined(job_title);

        company_id = this.checkifUndefined(company_id);
        default_country_id = this.checkifUndefined(default_country_id);
        job_type = this.checkifUndefined(job_type);
        job_category = this.checkifUndefined(job_category);
        location = this.checkifUndefined(location);
        industry = this.checkifUndefined(industry);

        job_description = helper.escapeString(job_description);
        job_description = this.checkifUndefined(job_description);

        job_responsibilities = helper.escapeString(job_responsibilities);
        job_responsibilities = this.checkifUndefined(job_responsibilities);

        min_qualification = this.checkifUndefined(min_qualification);
        experience_level = this.checkifUndefined(experience_level);
        min_year_of_experience = this.checkifUndefined(min_year_of_experience);
        max_year_of_experience = this.checkifUndefined(max_year_of_experience);
        expected_salary = this.checkifUndefined(expected_salary);
        gender_type = this.checkifUndefined(gender_type);
        application_deadline = this.formatDateUsingDateTime(this.checkifUndefined(application_deadline));
        minimum_age = this.checkifUndefined(minimum_age);
        maximum_age = this.checkifUndefined(maximum_age);
        required_skills = this.checkifUndefined(required_skills);
        shortlist_params = this.checkifUndefined(shortlist_params);
        application_channel = this.checkifUndefined(application_channel);
        external_application_link = this.checkifUndefined(external_application_link);
        status = this.checkifUndefined(status);

        var date_created = this.getCurrentTimeStamp();

        var sql = `INSERT INTO job(job_name, company_id, country_id, job_type_id, job_category_id, state_id, \
            industry, job_description, job_responsibilities, min_qualification, experience_level_id, \
            min_year_of_experience, max_year_of_experience, expected_salary, gender_type, \
            application_deadline, min_age, max_age, date_created, posted_by, status, shortlist_params, \
            required_skills, application_channel, external_application_link, is_deleted, is_approved) VALUES \
            ('${job_title}','${company_id}','${default_country_id}',\
            '${job_type}','${job_category}','${location}','${industry}','${job_description}',\
            '${job_responsibilities}','${min_qualification}','${experience_level}','${min_year_of_experience}',\
            '${max_year_of_experience}','${expected_salary}','${gender_type}','${application_deadline}',\
            '${minimum_age}','${maximum_age}','${date_created}','${user_id}','${status}',\
            '${shortlist_params}','${required_skills}','${application_channel}','${external_application_link}',\
            '${config.false}','${is_approved}')`;

        return sql;
    }

    static saveJobQuery(job_id, user_id) {
        var sql = `INSERT INTO saved_jobs(job_id, saved_by) VALUES (${job_id}, ${user_id})`;
        return sql;
    }

    removeSavedJob(saved_job_id) {
        var sql = `DELETE FROM saved_jobs WHERE saved_job_id = ${saved_job_id}`;

        return sql;
    }

    applyForJobQuery(job_id, user_id, cover_letter, additional_resume_url) {
        job_id = this.checkifUndefined(job_id);
        user_id = this.checkifUndefined(user_id);

        cover_letter = helper.escapeString(cover_letter);
        cover_letter = this.checkifUndefined(cover_letter);

        additional_resume_url = this.checkifUndefined(additional_resume_url);

        var date_created = this.getCurrentTimeStamp();

        var application_status = config.not_shortlisted;

        /*
               
                var result = this.shortlistingProcess(user_id, job_id);

                if(result){
                    application_status = config.shortlisted;
                } else{
                    application_status = config.declined;
                } */

        var sql = `INSERT INTO application (job_id, user_id, date_created, cover_letter, additional_resume_url, \
            application_status) VALUES \
        (${job_id}, ${user_id}, '${date_created}', '${cover_letter}', '${additional_resume_url}', '${application_status}')`;

        return sql;
    }

    static getJobByIdQuery(job_id) {
        var sql = `SELECT j.*, c.company_name, c.website, c.company_logo_url, c.address,\
                c.company_description, co.country_name, co.country_code, s.state_name, \
                jc.job_category_name, jt.job_type_name, el.experience_level_name, \
                q.qualification_name AS min_qualification_name FROM job j \
                INNER JOIN company c ON j.company_id = c.company_id \
                INNER JOIN country co ON j.country_id = co.country_id \
                INNER JOIN state s ON j.state_id = s.state_id \
                INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id \
                INNER JOIN qualification q ON j.min_qualification = q.qualification_id \
                WHERE job_id = ${job_id} AND is_deleted = ${config.false} AND is_approved = ${config.true}`;

        return sql;
    }

    static getJobByIdQueryRecruiter(job_id) {
        var sql = `SELECT j.*, c.company_name, c.website, c.company_logo_url, c.address,\
                c.company_description, co.country_name, co.country_code, s.state_name, \
                jc.job_category_name, jt.job_type_name, el.experience_level_name, \
                q.qualification_name AS min_qualification_name FROM job j \
                INNER JOIN company c ON j.company_id = c.company_id \
                INNER JOIN country co ON j.country_id = co.country_id \
                INNER JOIN state s ON j.state_id = s.state_id \
                INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id \
                INNER JOIN qualification q ON j.min_qualification = q.qualification_id \
                WHERE job_id = ${job_id} AND is_deleted = ${config.false}`;

        return sql;
    }

    static getJobByIdQueryAdmin(job_id) {
        var sql = `SELECT j.*, c.company_name, c.website, c.company_logo_url, c.address,\
                c.company_description, co.country_name, co.country_code, s.state_name, \
                jc.job_category_name, jt.job_type_name, el.experience_level_name, \
                q.qualification_name AS min_qualification_name FROM job j \
                INNER JOIN company c ON j.company_id = c.company_id \
                INNER JOIN country co ON j.country_id = co.country_id \
                INNER JOIN state s ON j.state_id = s.state_id \
                INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id \
                INNER JOIN qualification q ON j.min_qualification = q.qualification_id \
                WHERE job_id = ${job_id} AND is_deleted = '${config.false}'`;

        return sql;
    }

    static getJobNameByIdQuery(job_id) {
        var sql = `SELECT job_name FROM job WHERE job_id = ${job_id} \
            AND is_deleted = '${config.false}' AND is_approved = '${config.true}'`;

        return sql;
    }

    static getJobNameAndCreatorInfoByJobIdQuery(job_id) {
        var sql = `SELECT j.job_name, u.first_name, u.last_name, u.email \
                    FROM job j INNER JOIN user u ON u.user_id = j.posted_by WHERE j.job_id = ${job_id}`;

        return sql;
    }

    static getApplicationsByStatusQuery(application_status) {
        var sql = `SELECT * FROM application WHERE application_status = '${application_status}'`;

        return sql;
    }

    updateApplicationStatusQuery(application_id, application_status) {
        var sql = `UPDATE application set application_status = '${application_status}' \
        WHERE application_id = ${application_id}`;

        return sql;
    }

    updateApplicationStateQuery(application_id, application_state) {
        var sql = `UPDATE application set application_state = '${application_state}' \
        WHERE application_id = ${application_id}`;

        return sql;
    }

    checkIfUserAppliedToJob(job_id, user_id) {
        job_id = this.checkifUndefined(job_id);
        user_id = this.checkifUndefined(user_id);

        var sql = `SELECT COUNT(*) AS count FROM application WHERE job_id = ${job_id} AND user_id = ${user_id}`;

        return sql;
    }

    editJobPostQuery(job_id, job_title, job_type, job_category, location, industry, job_description,
        job_responsibilities, min_qualification, experience_level, min_year_of_experience,
        max_year_of_experience, expected_salary, gender_type, application_deadline, minimum_age, maximum_age,
        required_skills, shortlist_params, application_channel, external_application_link) {

        job_title = helper.escapeString(job_title);
        job_title = this.checkifUndefined(job_title);

        //company_id = this.checkifUndefined(company_id);
        //default_country_id = this.checkifUndefined(default_country_id);
        job_type = this.checkifUndefined(job_type);
        job_category = this.checkifUndefined(job_category);
        location = this.checkifUndefined(location);
        industry = this.checkifUndefined(industry);

        job_description = helper.escapeString(job_description);
        job_description = this.checkifUndefined(job_description);

        job_responsibilities = helper.escapeString(job_responsibilities);
        job_responsibilities = this.checkifUndefined(job_responsibilities);

        min_qualification = this.checkifUndefined(min_qualification);
        experience_level = this.checkifUndefined(experience_level);
        min_year_of_experience = this.checkifUndefined(min_year_of_experience);
        max_year_of_experience = this.checkifUndefined(max_year_of_experience);
        expected_salary = this.checkifUndefined(expected_salary);
        gender_type = this.checkifUndefined(gender_type);
        application_deadline = this.checkifUndefined(application_deadline);
        minimum_age = this.checkifUndefined(minimum_age);
        maximum_age = this.checkifUndefined(maximum_age);
        required_skills = this.checkifUndefined(required_skills);
        shortlist_params = this.checkifUndefined(shortlist_params);

        application_channel = this.checkifUndefined(application_channel);
        external_application_link = this.checkifUndefined(external_application_link);

        var date_updated = this.getCurrentTimeStamp();

        var sql = `UPDATE job SET job_name='${job_title}', job_type_id=${job_type}, job_category_id=${job_category}, \
                state_id=${location}, industry=${industry}, job_description='${job_description}', \
                job_responsibilities='${job_responsibilities}', min_qualification='${min_qualification}', \
                experience_level_id=${experience_level}, min_year_of_experience='${min_year_of_experience}', \
                max_year_of_experience='${max_year_of_experience}', expected_salary='${expected_salary}', gender_type='${gender_type}', \
                application_deadline='${application_deadline}', min_age='${minimum_age}', max_age='${maximum_age}', \
                required_skills='${required_skills}', shortlist_params='${shortlist_params}', \
                application_channel='${application_channel}', external_application_link='${external_application_link}', \
                date_updated='${date_updated}' WHERE job_id = ${job_id}`;

        return sql;
    }

    static deleteJobByIdQuery(job_id) {
        var sql = `UPDATE job SET is_deleted = '${config.true}' WHERE job_id = ${job_id}`;
        return sql;
    }

    expireJobQuery(job_id) {
        var sql = `UPDATE job SET status = '${config.expired}' WHERE job_id = ${job_id}`;

        return sql;
    }

    static getAllJobsQuery() {
        var sql = `SELECT j.*, c.company_name, co.country_name, s.state_name, jc.job_category_name, \
                jt.job_type_name, el.experience_level_name FROM job j \
                INNER JOIN company c ON j.company_id = c.company_id \
                INNER JOIN country co ON j.country_id = co.country_id \
                INNER JOIN state s ON j.state_id = s.state_id \
                INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id \
                WHERE j.is_deleted = ${config.false} AND j.is_approved = ${config.true} \
                AND j.application_deadline >= CURDATE() \
                ORDER BY j.date_created DESC`;
        return sql;
    }

    static searchJobsQuery(keyword, location) {

        var params = { "keyword": keyword, "industry": keyword, "state": location, "country": location }

        var conditions = Job.buildSearchConditions(params);

        var sql = `SELECT DISTINCT j.* FROM job j, state s, country c WHERE ` + conditions.where + ` AND j.is_deleted = ${config.false} AND j.is_approved = ${config.true}`;


        logger.log("sql: " + sql)
        return sql;
    }

    static keywordSearch(keyword) {
        var sql = `SELECT j.*, c.company_name, co.country_name, s.state_name, jc.job_category_name, 
                jt.job_type_name, el.experience_level_name FROM job j 
                INNER JOIN company c ON j.company_id = c.company_id 
                INNER JOIN country co ON j.country_id = co.country_id 
                INNER JOIN state s ON j.state_id = s.state_id 
                INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id 
                INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id 
                INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id 
                WHERE is_deleted = 0 AND is_approved = ${config.true}
                
                AND LOWER(j.job_name) LIKE LOWER('%${keyword}%')
                OR LOWER(j.job_description) LIKE LOWER('%${keyword}%')
                OR LOWER(j.job_responsibilities) LIKE LOWER('%${keyword}%')
                OR LOWER(j.required_skills) LIKE LOWER('%${keyword}%')
                ORDER BY j.date_created DESC`;

        return sql;
    }

    static getRecruiterLast5PostedJobs(user_id) {
        var sql = `SELECT j.*, c.company_name, co.country_name, s.state_name, jc.job_category_name, 
                jt.job_type_name, el.experience_level_name, 
                (SELECT COUNT(*) FROM application a WHERE a.job_id = j.job_id) AS no_of_applications 
                FROM job j 
                INNER JOIN company c ON j.company_id = c.company_id 
                INNER JOIN country co ON j.country_id = co.country_id 
                INNER JOIN state s ON j.state_id = s.state_id 
                INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id 
                INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id 
                INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id 
                WHERE is_deleted = '0' AND posted_by = ${user_id} ORDER BY j.date_created DESC LIMIT 5`;

        return sql;
    }

    static getAllRecruiterPostedJobs(user_id) {
        var sql = `SELECT j.job_id, j.job_name, j.date_created, j.application_deadline, \
                j.status, jt.job_type_name, \
                (SELECT COUNT(*) FROM application a WHERE a.job_id = j.job_id) AS no_of_applications \
                FROM job j \
                INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                WHERE is_deleted = '0' AND posted_by = ${user_id} ORDER BY j.date_created DESC`;

        return sql;
    }

    static getAllAdminApprovedJobs(user_id) {
        var sql = `SELECT j.job_id, j.job_name, j.date_created, j.application_deadline, \
                j.status, jt.job_type_name, c.company_name, \
                (SELECT COUNT(*) FROM application a WHERE a.job_id = j.job_id) AS no_of_applications
                FROM job j 
                INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id
                INNER JOIN company c ON j.posted_by = c.created_by
                WHERE is_deleted = '0' AND is_approved = ${config.true} AND created_by != ${user_id} ORDER BY j.date_created DESC`;

        return sql;
    }

    static getAllAdminPendingJobs(user_id) {
        var sql = `SELECT j.job_id, j.job_name, j.date_created, j.application_deadline, \
                j.status, jt.job_type_name, c.company_name, \
                (SELECT COUNT(*) FROM application a WHERE a.job_id = j.job_id) AS no_of_applications
                FROM job j 
                INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id
                INNER JOIN company c ON j.posted_by = c.created_by
                WHERE is_deleted = '0' AND is_approved = ${config.false} AND created_by != ${user_id} ORDER BY j.date_created DESC`;

        return sql;
    }

    static getCountOfAllJobs() {
        var sql = `SELECT COUNT(*) as total_job_count FROM job`;

        return sql;
    }

    static getCountOfJobApplication(job_id) {
        var sql = `SELECT COUNT(*) AS count FROM application WHERE job_id = ${job_id}`;

        return sql;
    }

    static searchJobsByLocationQuery(location) {
        var params = { "state": location, "country": location };

        var conditions = Job.buildLocationSearchConditions(params);

        var sql = `SELECT DISTINCT * FROM state s, country c WHERE ` + conditions.where;

        return sql;
    }

    static getAllJobApplicants(job_id) {
        var sql = `SELECT a.*, a.date_created AS date_applied, u.*, j.*, 
                    (SELECT state_name FROM state WHERE state_id = u.state) AS state_name 
                    FROM application a
                    INNER JOIN job j ON a.job_id = j.job_id 
                    INNER JOIN user u ON a.user_id = u.user_id
                    WHERE a.job_id = ${job_id}`;

        return sql;
    }

    static getAllShortlistedJobApplicants(job_id) {
        var sql = `SELECT a.*, a.date_created AS date_applied, u.*, j.*, 
                    (SELECT state_name FROM state WHERE state_id = u.state) AS state_name 
                    FROM application a 
                    INNER JOIN job j ON a.job_id = j.job_id 
                    INNER JOIN user u ON a.user_id = u.user_id
                    WHERE a.job_id = ${job_id} AND a.application_status = ${config.ap_status_shortlisted}`;

        return sql;
    }

    static getAllRejectedJobApplicants(job_id) {
        var sql = `SELECT a.*, a.date_created AS date_applied, u.*, j.*, 
                    (SELECT state_name FROM state WHERE state_id = u.state) AS state_name 
                    FROM application a 
                    INNER JOIN job j ON a.job_id = j.job_id 
                    INNER JOIN user u ON a.user_id = u.user_id
                    WHERE a.job_id = ${job_id} AND a.application_status = ${config.ap_status_not_recommended}
                    AND a.application_status = ${config.ap_status_not_recommended_incomplete_info}`;

        return sql;
    }

    static getAllNonShortlistedJobApplicants(job_id) {
        var sql = `SELECT a.*, a.date_created AS date_applied, u.*, j.* FROM application a
                    INNER JOIN job j ON a.job_id = j.job_id 
                    INNER JOIN user u ON a.user_id = u.user_id
                    WHERE a.job_id = ${job_id} AND a.application_status = ${config.ap_status_not_recommended}`;

        return sql;
    }

    static getAllJobApplicantsForExcel(job_id) {
        var sql = `SELECT a.application_status, a.date_created AS date_applied, u.user_id,\
            u.first_name, u.last_name, u.email, u.phone_number, s.state_name, c.country_name \
            FROM application a \
            INNER JOIN user u ON a.user_id = u.user_id \
            INNER JOIN state s ON s.state_id = u.state \
            INNER JOIN country c ON c.country_id = u.country \
            WHERE a.job_id = ${job_id}`;

        return sql;
    }

    static getAllShortlistedJobApplicantsForExcel(job_id) {
        var sql = `SELECT a.application_status, a.date_created AS date_applied, u.user_id, \
            u.first_name, u.last_name, u.email, u.phone_number, s.state_name, c.country_name \ 
            FROM application a \
            INNER JOIN user u ON a.user_id = u.user_id \
            INNER JOIN state s ON s.state_id = u.state \
            INNER JOIN country c ON c.country_id = u.country \
            WHERE a.job_id = ${job_id} AND a.application_status = ${config.ap_status_shortlisted}`;

        return sql;
    }

    static getAllNonShortlistedJobApplicantsForExcel(job_id) {
        var sql = `SELECT a.application_status, a.date_created AS date_applied, u.user_id, \
            u.first_name, u.last_name, u.email, u.phone_number, s.state_name, c.country_name \
            FROM application a \
            INNER JOIN user u ON a.user_id = u.user_id \
            INNER JOIN state s ON s.state_id = u.state \
            INNER JOIN country c ON c.country_id = u.country \
            WHERE a.job_id = ${job_id} AND a.application_status = ${config.ap_status_not_recommended}`;

        return sql;
    }

    getUserResumeByUserId(user_id) {
        var sql = `SELECT * FROM resume WHERE user_id = ${user_id}`;

        return sql;
    }

    getAllShortlistParams(job_id) {
        var sql = `SELECT shortlist_params FROM job WHERE job_id = ${job_id}`;

        return sql;
    }

    static buildSearchConditions(params) {
        var conditions = [];

        if (typeof params.keyword !== 'undefined') {
            conditions.push(`LOWER(j.job_name) LIKE LOWER('%${params.keyword}%') OR \
           LOWER(j.job_description) LIKE LOWER('%${params.keyword}%')`);
        }

        if (typeof params.country !== 'undefined') {
            conditions.push(`c.country_id = '${params.country}'`);
        }

        if (typeof params.state !== 'undefined') {
            conditions.push(`s.state_id = '${params.state}'`);
        }

        return {
            where: conditions.length ?
                conditions.join(' AND ') : '1',

        };
    }

    static buildLocationSearchConditions(params) {
        var conditions = [];

        if (typeof params.country !== 'undefined') {
            conditions.push(`c.country_id = '${params.country}'`);
        }

        if (typeof params.state !== 'undefined') {
            conditions.push(`s.state_id = '${params.state}'`);
        }

        return {
            where: conditions.length ?
                conditions.join(' AND ') : '1',

        };
    }

    static dynamicUpdateQuery() {
        var whereData = [
            ['user_id', 3],
            ['is_deleted', 0],
            ['phone_number', '08687989448']
        ]
        var data = [
            ['fullname', 'tobi'],
            ['email', 't@y.com'],
            ['phone_number', '08687989448']
        ]
        var operation = 'or'
        var text = '';
        var where = ''
        var refinedData, refinedWhereData = "";

        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data.length; j += 3) {
                refinedData = `'${data[i][j]}' = '${data[i][j+1]}'`

                logger.log(`REFINED: '${data[i][j]}' = '${data[i][j+1]}'`);

            }
            text += refinedData + ', '
        }

        for (var i = 0; i < whereData.length; i++) {
            for (var j = 0; j < whereData.length; j += 3) {
                refinedWhereData = `'${whereData[i][j]}' = '${whereData[i][j+1]}'`

                logger.log(`REFINED-WHERE: '${whereData[i][j]}' = '${whereData[i][j+1]}'`);

            }
            where += refinedWhereData + operation
        }

        var sql = `UPDATE user SET ${text} WHERE ${where}`;
        logger.log(sql)

        return (sql);
    }

    checkifUndefined(value) {
        if (typeof value === 'undefined') {
            return null;
        } else {
            return value;
        }
    }

    getCurrentTimeStamp() {
        var dt = dateTime.create();
        var date_created = dt.format('Y-m-d H:M:S');

        return date_created;
    }

    formatDateUsingDateTime(dateToFormat) {
        var dt = dateTime.create(dateToFormat);

        return dt.format('Y-m-d H:M:S');
    }



    shortlistingProcess(user_id, job_id) {
        'use strict';
        var isShortlisted = false;
        var getShortlistParamQuery = `SELECT shortlist_params FROM job WHERE job_id = ${job_id}`;

        db.query(getShortlistParamQuery, (err, data) => {
            if (!err) {
                var paramString = data[0].shortlist_params;
                var params = paramString.split(',');

                if (params.includes(config.age_shortlist_param_code)) {

                    var result = this.calculateAgeForShortlist(user_id, job_id);
                }

                if (params.includes(config.qualification_shortlist_param_code)) {
                    var isShortlisted = this.calculateQualificationForShortlist(user_id, job_id);

                    logger.log("qualification shortlist_result - " + isShortlisted)
                }
                if (params.includes(config.yoe_shortlist_param_code)) {
                    var isShortlisted = this.calculateYearOfExperienceForShortlist(user_id, job_id);

                    logger.log("YOE shortlist_result - " + isShortlisted)
                }
                if (params.includes(config.gender_shortlist_param_code)) {
                    var isShortlisted = this.calculateGenderForShortlist(user_id, job_id);

                    logger.log("Gender shortlist_result - " + isShortlisted);
                }


                logger.log(params);
            } else {
                logger.log(err);
            }

        })
    }

    newShortlistProcess(req, res, user_id, job_id, job_name) {
        logger.log("Starting shortlist process");

        var getShortlistParamQuery = `SELECT shortlist_params FROM job WHERE job_id = ${job_id}`;

        db.query(getShortlistParamQuery, (err, data) => {
            if (!err) {
                var paramString = data[0].shortlist_params;
                var params = paramString.split(',');

                if (paramString.length > 0 && params.length > 0) {

                    this.startShortlistProcess(req, res, user_id, job_id, job_name, params);
                } else {
                    logger.log("Shortlist Status = true");
                    this.saveShortlistStatus(req, user_id, job_id, job_name, config.ap_status_shortlisted, "");
                }
            } else {
                logger.log(err);
            }
        })
    }

    startShortlistProcess(req, res, user_id, job_id, job_name, params) {
        this.calculateAgeForShortlist(req, res, user_id, job_id, job_name, params);
    }

    calculateAgeFromDOB(dob) {
        var today = new Date();
        var birthDate = new Date(dob);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    calculateAgeForShortlist(req, res, user_id, job_id, job_name, params) {
        if (params.includes(config.age_shortlist_param_code)) {
            var sql = `SELECT u.dob, j.min_age, j.max_age FROM user u, job j WHERE \
                u.user_id = ${user_id} AND j.job_id = ${job_id}`;

            db.query(sql, (err, data) => {

                if (!err) {
                    var dob = data[0].dob;

                    if (dob && typeof dob != 'undefined' && dob != 'null' && dob != '' && dob != null) {
                        var user_age = this.calculateAgeFromDOB(data[0].dob);

                        var min_age = data[0].min_age;
                        var max_age = data[0].max_age;

                        if (user_age >= min_age && user_age <= max_age) {
                            logger.log('AGE - true');
                            this.calculateYearOfExperienceForShortlist(req, res, user_id, job_id, job_name, params);
                        } else {
                            logger.log('AGE - false (doesnt fit)');

                            this.saveShortlistStatus(req, user_id, job_id, job_name, config.ap_status_not_recommended_incomplete_info, "");
                        }
                    } else {
                        logger.log('AGE - false (no age)');
                        this.saveShortlistStatus(req, user_id, job_id, job_name, config.ap_status_not_recommended, "Age");
                    }
                }
            });
        } else {
            this.calculateYearOfExperienceForShortlist(req, res, user_id, job_id, job_name, params);
        }
    }

    calculateYearOfExperienceForShortlist(req, res, user_id, job_id, job_name, params) {
        if (params.includes(config.yoe_shortlist_param_code)) {
            var sql = `SELECT we.start_date, we.end_date, we.user_id, j.min_year_of_experience, j.max_year_of_experience \
                FROM work_experience we, job j WHERE j.job_id = ${job_id} AND we.user_id = ${user_id}`;

            db.query(sql, (err, data) => {
                if (!err) {
                    var job_min_year_of_experience = parseInt(data[0].min_year_of_experience);
                    var job_max_year_of_experience = parseInt(data[0].max_year_of_experience);

                    var no_of_years = [];
                    var users_total_no_of_experience = 0;

                    for (var i = 0; i < data.length; i++) {
                        if (data[i].start_date && data[i].end_date) {
                            var start_date = moment(data[i].start_date, 'YYYY-MM-DD');
                            var end_date = moment(data[i].end_date, 'YYYY-MM-DD');

                            no_of_years.push(this.calculateYearBetweenTwoDates(start_date, end_date));
                            users_total_no_of_experience += no_of_years[i];
                        }
                    }

                    if (users_total_no_of_experience > 0) {
                        if (users_total_no_of_experience >= job_min_year_of_experience &&
                            users_total_no_of_experience <= job_max_year_of_experience) {

                            logger.log('YOE - true');
                            this.calculateQualificationForShortlist(req, res, user_id, job_id, job_name, params);
                        } else {
                            logger.log('YOE - false (doesnt fit)');
                            this.saveShortlistStatus(req, user_id, job_id, job_name, config.ap_status_not_recommended, "");
                        }
                    } else {
                        logger.log('YOE - false (no experience)');
                        this.saveShortlistStatus(req, user_id, job_id, job_name, config.ap_status_not_recommended_incomplete_info,
                            "Year of Experience");
                    }
                }
            });
        } else {
            this.calculateQualificationForShortlist(req, res, user_id, job_id, job_name, params);
        }
    }

    calculateQualificationForShortlist(req, res, user_id, job_id, job_name, params) {
        if (params.includes(config.qualification_shortlist_param_code)) {
            var sql = `SELECT j.min_qualification, e.qualification, e.qualification_grade FROM \
                job j, education e WHERE j.job_id = ${job_id} AND e.user_id = ${user_id}`;

            db.query(sql, (err, data) => {
                if (!err) {
                    var job_min_qualification = data[0].min_qualification;

                    var user_qualifications = [];
                    var user_qualification_grade = [];

                    for (var i = 0; i < data.length; i++) {
                        if (data[i].qualification) {
                            user_qualifications.push(parseInt(data[i].qualification));
                            user_qualification_grade.push(data[i].qualification_grade);
                        }
                    }

                    if (user_qualifications.length > 0) {
                        var highest_user_qualification = Math.max.apply(Math, user_qualifications);

                        if (highest_user_qualification >= job_min_qualification) {
                            logger.log('QUALIFICATION - true');
                            this.calculateGenderForShortlist(req, res, user_id, job_id, job_name, params);
                        } else {
                            logger.log('QUALIFICATION - false (doesnt fit)');
                            this.saveShortlistStatus(req, user_id, job_id, job_name, config.ap_status_not_recommended, "");
                        }
                    } else {
                        logger.log('QUALIFICATION - false (no qualification)');
                        this.saveShortlistStatus(req, user_id, job_id, job_name, config.ap_status_not_recommended_incomplete_info,
                            "Qualification");
                    }
                }
            });
        } else {
            this.calculateGenderForShortlist(req, res, user_id, job_id, job_name, params);
        }
    }

    calculateGenderForShortlist(req, res, user_id, job_id, job_name, params) {
        if (params.includes(config.gender_shortlist_param_code)) {
            var sql = `SELECT u.gender, j.gender_type FROM user u, job j \
                WHERE j.job_id = ${job_id} AND u.user_id = ${user_id}`;

            db.query(sql, (err, data) => {
                if (!err) {
                    var user_gender = data[0].gender;
                    var job_gender_type = data[0].gender_type;

                    if (user_gender && typeof user_gender != 'undefined' && user_gender != 'null' &&
                        user_gender != '' && user_gender != null) {

                        if (job_gender_type === config.gender_status_all) {
                            logger.log('GENDER - true');
                            this.saveShortlistStatus(req, user_id, job_id, job_name, config.ap_status_shortlisted, "");
                        } else if (user_gender === job_gender_type) {
                            logger.log('GENDER - true');
                            this.saveShortlistStatus(req, user_id, job_id, job_name, config.ap_status_shortlisted, "");
                        } else {
                            logger.log('GENDER - false (doesnt fit)');
                            this.saveShortlistStatus(req, user_id, job_id, job_name, config.ap_status_not_recommended, "");
                        }
                    } else {
                        logger.log('GENDER - false (no gender)');
                        this.saveShortlistStatus(req, user_id, job_id, job_name, config.ap_status_not_recommended_incomplete_info,
                            "Gender");
                    }
                }
            });
        } else {
            logger.log('Shortlist done')
                /*res.status(200).json({
                    message: "Shortlist Status",
                    shortlistStatus: true
                }); */
        }
    }

    saveShortlistStatus(req, user_id, job_id, job_name, shortlist_status, info_missing) {
        try {
            var userData = req.session.passport.user;
            var recipient_full_name = userData.first_name + " " + userData.last_name;
            var recipient_email = userData.email;

            var sql = `UPDATE application SET application_status = ${shortlist_status} \
                        WHERE job_id = ${job_id} AND user_id = ${user_id}`;

            db.query(sql, (err, data) => {
                if (!err) {
                    logger.log('Shortlist Done');

                    if (shortlist_status == config.ap_status_shortlisted) {
                        logger.log('Sending success shortlist mail');
                        //mailer.sendSuccessShortlistMail(recipient_full_name, recipient_email, job_name);
                    } else if (shortlist_status == config.ap_status_not_recommended_incomplete_info) {
                        logger.log('Sending failure mail (incomplete info)');
                        //mailer.sendFailedShortlistDueToIncompleteDataMail(recipient_full_name, recipient_email, job_name, info_missing);
                    } else {
                        logger.log('Sending failure shortlist mail');
                        //mailer.sendFailedShortlistMail(recipient_full_name, recipient_email, job_name);
                    }

                } else {
                    logger.log(err);
                }
            });
        } catch (error) {
            logger.log(error);
        }
    }


    calculateYearBetweenTwoDates(first_date, second_date) {
        var no_of_years = moment.duration(second_date - first_date).years();
        return no_of_years;
    }

    jobRecommendationProcess(user_id, callback) {

        //Get recommended jobs by qualification
        this.getJobsByUsersQualification(user_id, function(err, data) {
            if (err) {
                logger.log("ERROR : ", err);
            } else {
                logger.log("result from qual query is : " + data.length);

                var jobsByQualification = data;

                //Get recommended jobs by gender
                var job = new Job();
                job.getJobsByUsersGender(user_id, function(err, data) {
                    var allUsersRecommendedJobs;

                    if (err) {
                        logger.log("ERROR : ", err);
                    } else {
                        logger.log("result from gender db is : ", data.length);

                        var jobsByGender = data;

                        allUsersRecommendedJobs = jobsByQualification.concat(jobsByGender);


                    }

                    callback(null, helper.sortRecommendedJobsArray(allUsersRecommendedJobs))
                });
            }
        });
    }

    jobRecommendationProcessForDashboard(user_id, callback) {

        //Get recommended jobs by qualification
        this.getJobsByUsersQualificationForDashboard(user_id, function(err, data) {
            if (err) {
                logger.log("ERROR : ", err);
            } else {
                logger.log("result from qual query is : " + data.length);

                var jobsByQualification = data;

                //Get recommended jobs by gender
                var job = new Job();
                job.getJobsByUsersGenderForDashboard(user_id, function(err, data) {
                    var allUsersRecommendedJobs;

                    if (err) {
                        logger.log("ERROR : ", err);
                    } else {
                        logger.log("result from gender db is : ", data.length);

                        var jobsByGender = data;

                        allUsersRecommendedJobs = jobsByQualification.concat(jobsByGender);


                    }

                    callback(null, helper.sortRecommendedJobsArray(allUsersRecommendedJobs))
                });
            }
        });
    }

    jobRecommendationProcessWithFilter(user_id, filter, callback) {

        //Get recommended jobs by qualification
        this.getJobsByUsersQualificationWithFilter(user_id, filter, function(err, data) {
            if (err) {
                logger.log("ERROR : ", err);
            } else {
                logger.log("result from qual query is : " + data.length);

                var jobsByQualification = data;

                //Get recommended jobs by gender
                var job = new Job();
                job.getJobsByUsersGenderWithFilter(user_id, filter, function(err, data) {
                    var allUsersRecommendedJobs;

                    if (err) {
                        logger.log("ERROR : ", err);
                    } else {
                        logger.log("result from gender db is : ", data.length);

                        var jobsByGender = data;

                        allUsersRecommendedJobs = jobsByQualification.concat(jobsByGender);
                    }

                    callback(null, helper.sortRecommendedJobsArray(allUsersRecommendedJobs))
                });
            }
        });
    }

    jobRecommendationsCount(user_id, callback) {

        //Get recommended jobs by qualification
        this.getJobsByUsersQualification(user_id, function(err, data) {
            if (err) {
                logger.log("ERROR : ", err);
            } else {
                logger.log("result from qual query is : " + data.length);

                var jobsByQualification = data;

                //Get recommended jobs by gender
                var job = new Job();
                job.getJobsByUsersGender(user_id, function(err, data) {
                    var allUsersRecommendedJobs;

                    if (err) {
                        logger.log("ERROR : ", err);
                    } else {
                        logger.log("result from gender db is : ", data.length);

                        var jobsByGender = data;

                        allUsersRecommendedJobs = jobsByQualification.concat(jobsByGender);


                    }

                    var count = helper.sortRecommendedJobsArray(allUsersRecommendedJobs).length;

                    callback(null, count);
                });
            }
        });
    }

    getJobsByUsersGender(user_id, callback) {
        var sql = `SELECT j.*, c.company_name, c.company_logo_url, c.company_description, \
                co.country_name, s.state_name, jc.job_category_name, \
                jt.job_type_name, el.experience_level_name, \
                (SELECT COUNT(*) FROM application a WHERE a.user_id = ${user_id} AND \
                a.job_id = j.job_id) AS application_status
                FROM job j \
                INNER JOIN company c ON j.company_id = c.company_id \
                INNER JOIN country co ON j.country_id = co.country_id \
                INNER JOIN state s ON j.state_id = s.state_id \
                INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id \
                WHERE j.application_deadline >= CURDATE() \
                AND j.is_approved = '${config.true}' \
                AND LOWER(j.gender_type) = LOWER("All") OR \
                LOWER(j.gender_type) = LOWER((SELECT u.gender from user u where u.user_id = ${user_id})) \
                ORDER BY j.date_created DESC`;

        db.query(sql, (err, data) => {
            if (!err) {
                if (data) {
                    callback(null, data);
                }
            } else {
                callback(err, null);
            }
        });
    }

    getJobsByUsersGenderWithFilter(user_id, filter, callback) {
        var sql = `SELECT j.*, c.company_name, c.company_logo_url, c.company_description, \
                co.country_name, s.state_name, jc.job_category_name, \
                jt.job_type_name, el.experience_level_name, \
                (SELECT COUNT(*) FROM application a WHERE a.user_id = ${user_id} AND \
                a.job_id = j.job_id) AS application_status
                FROM job j \
                INNER JOIN company c ON j.company_id = c.company_id \
                INNER JOIN country co ON j.country_id = co.country_id \
                INNER JOIN state s ON j.state_id = s.state_id \
                INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id \
                WHERE j.application_deadline >= CURDATE() \
                AND j.is_approved = '${config.true}' \
                AND (LOWER(j.gender_type) = LOWER("All") OR \
                LOWER(j.gender_type) = LOWER((SELECT u.gender from user u where u.user_id = ${user_id})))`;

        if (typeof filter != 'undefined' && filter) {
            sql += ` AND j.job_type_id = ${filter}`;
        }

        sql += ` ORDER BY j.date_created DESC`;

        db.query(sql, (err, data) => {
            if (!err) {
                if (data) {
                    callback(null, data);
                }
            } else {
                callback(err, null);
            }
        });
    }

    getJobsByUsersQualification(user_id, callback) {
        var sql = `SELECT j.*, c.company_name, c.company_logo_url, c.company_description, \
                    co.country_name, s.state_name, jc.job_category_name, \
                    jt.job_type_name, el.experience_level_name, \
                    (SELECT COUNT(*) FROM application a WHERE a.user_id = ${user_id} AND \
                    a.job_id = j.job_id) AS application_status
                    FROM job j \
                    INNER JOIN company c ON j.company_id = c.company_id \
                    INNER JOIN country co ON j.country_id = co.country_id \
                    INNER JOIN state s ON j.state_id = s.state_id \
                    INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                    INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                    INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id \
                    WHERE j.application_deadline >= CURDATE() \
                    AND j.is_approved = '${config.true}' \
                    AND min_qualification <= (SELECT MAX(qualification) AS user_qualification FROM education \
                    WHERE user_id = ${user_id}) ORDER BY j.date_created DESC`;

        db.query(sql, (err, data) => {
            if (!err) {
                if (data) {
                    callback(null, data);
                }
            } else {
                callback(err, null);
            }
        });
    }

    getJobsByUsersQualificationWithFilter(user_id, filter, callback) {
        var sql = `SELECT j.*, c.company_name, c.company_logo_url, c.company_description, \
                    co.country_name, s.state_name, jc.job_category_name, \
                    jt.job_type_name, el.experience_level_name, \
                    (SELECT COUNT(*) FROM application a WHERE a.user_id = ${user_id} AND \
                    a.job_id = j.job_id) AS application_status
                    FROM job j \
                    INNER JOIN company c ON j.company_id = c.company_id \
                    INNER JOIN country co ON j.country_id = co.country_id \
                    INNER JOIN state s ON j.state_id = s.state_id \
                    INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                    INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                    INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id \
                    WHERE j.application_deadline >= CURDATE() \
                    AND j.is_approved = '${config.true}' \
                    AND min_qualification <= (SELECT MAX(qualification) AS user_qualification FROM education \
                    WHERE user_id = ${user_id})`;

        if (typeof filter != 'undefined' && filter) {
            sql += ` AND j.job_type_id = ${filter}`;
        }

        sql += ` ORDER BY j.date_created DESC`;

        db.query(sql, (err, data) => {
            if (!err) {
                if (data) {
                    callback(null, data);
                }
            } else {
                callback(err, null);
            }
        });
    }

    getJobsByUsersGenderForDashboard(user_id, callback) {
        var sql = `SELECT j.*, c.company_name, c.company_logo_url, c.company_description, \
                co.country_name, s.state_name, jc.job_category_name, \
                jt.job_type_name, el.experience_level_name, \
                (SELECT COUNT(*) FROM application a WHERE a.user_id = ${user_id} AND \
                a.job_id = j.job_id) AS application_status
                FROM job j \
                INNER JOIN company c ON j.company_id = c.company_id \
                INNER JOIN country co ON j.country_id = co.country_id \
                INNER JOIN state s ON j.state_id = s.state_id \
                INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id \
                WHERE j.application_deadline >= CURDATE() \
                AND j.is_approved = '${config.true}' \
                AND LOWER(j.gender_type) = LOWER("All") OR \
                LOWER(j.gender_type) = LOWER((SELECT u.gender from user u where u.user_id = ${user_id})) \
                ORDER BY j.date_created DESC LIMIT 10`;

        db.query(sql, (err, data) => {
            if (!err) {
                if (data) {
                    callback(null, data);
                }
            } else {
                callback(err, null);
            }
        });
    }

    getJobsByUsersQualificationForDashboard(user_id, callback) {
        var sql = `SELECT j.*, c.company_name, c.company_logo_url, c.company_description, \
                    co.country_name, s.state_name, jc.job_category_name, \
                    jt.job_type_name, el.experience_level_name, \
                    (SELECT COUNT(*) FROM application a WHERE a.user_id = ${user_id} AND \
                    a.job_id = j.job_id) AS application_status
                    FROM job j \
                    INNER JOIN company c ON j.company_id = c.company_id \
                    INNER JOIN country co ON j.country_id = co.country_id \
                    INNER JOIN state s ON j.state_id = s.state_id \
                    INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                    INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                    INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id \
                    WHERE j.application_deadline >= CURDATE() \
                    AND j.is_approved = '${config.true}' \
                    AND min_qualification <= (SELECT MAX(qualification) AS user_qualification FROM education \
                    WHERE user_id = ${user_id}) ORDER BY j.date_created DESC LIMIT 10`;

        db.query(sql, (err, data) => {
            if (!err) {
                if (data) {
                    callback(null, data);
                }
            } else {
                callback(err, null);
            }
        });
    }

    get5RecommendedJobs(user_id) {
        var sql = `SELECT j.job_id, j.job_name, c.company_name, c.company_logo_url, \
                    co.country_name, s.state_name, jc.job_category_name, jt.job_type_name \
                    FROM job j \
                    INNER JOIN company c ON j.company_id = c.company_id \
                    INNER JOIN country co ON j.country_id = co.country_id \
                    INNER JOIN state s ON j.state_id = s.state_id \
                    INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                    INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                    WHERE j.application_deadline >= CURDATE() \
                    AND j.is_approved = '${config.true}' \
                    AND (SELECT COUNT(*) FROM application a WHERE a.user_id = ${user_id} AND \
                    a.job_id = j.job_id) != 1 \
                    ORDER BY j.date_created DESC LIMIT 5`;

        return sql;
    }

    get10LatestJobs() {
        var sql = `SELECT j.job_id, j.job_name, c.company_name, c.company_logo_url, \
                    co.country_name, s.state_name, jc.job_category_name, jt.job_type_name \
                    FROM job j \
                    INNER JOIN company c ON j.company_id = c.company_id \
                    INNER JOIN country co ON j.country_id = co.country_id \
                    INNER JOIN state s ON j.state_id = s.state_id \
                    INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                    INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                    WHERE j.application_deadline >= CURDATE() \
                    AND j.is_approved = '${config.true}' \
                    AND j.is_deleted = '${config.false}' \
                    ORDER BY j.date_created DESC LIMIT 10`;

        return sql;
    }

    get10LatestMedicalJobs() {
        var sql = `SELECT j.job_id, j.job_name, c.company_name, c.company_logo_url, \
                    co.country_name, s.state_name, jc.job_category_name, jt.job_type_name \
                    FROM job j \
                    INNER JOIN company c ON j.company_id = c.company_id \
                    INNER JOIN country co ON j.country_id = co.country_id \
                    INNER JOIN state s ON j.state_id = s.state_id \
                    INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                    INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                    WHERE j.application_deadline >= CURDATE() \
                    AND j.is_approved = '${config.true}' \
                    AND j.is_deleted = '${config.false}' \
                    AND j.job_category_id = 10 \
                    ORDER BY j.date_created DESC LIMIT 10`;

        return sql;
    }

    getTempLatestJobs() {
        var sql = `SELECT j.*, c.company_name, co.country_name, s.state_name, jc.job_category_name, \
                    jt.job_type_name, el.experience_level_name FROM job j \
                    INNER JOIN company c ON j.company_id = c.company_id \
                    INNER JOIN country co ON j.country_id = co.country_id \
                    INNER JOIN state s ON j.state_id = s.state_id \
                    INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                    INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                    INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id \
                    WHERE j.job_id IN (5108, 5573, 5576, 5577, 5578, 5579, 5580, 5581, 5582, 5583, 5584, 5585, 5586, 5587) \
                    AND j.application_deadline >= CURDATE() \
                    AND j.is_approved = '${config.true}' \
                    AND j.is_deleted = '${config.false}' \
                    ORDER BY j.date_created DESC`;

        return sql;
    }

    getTempSterlingJobs() {
        var sql = `SELECT j.*, c.company_name, co.country_name, s.state_name, jc.job_category_name, \
                    jt.job_type_name, el.experience_level_name FROM job j \
                    INNER JOIN company c ON j.company_id = c.company_id \
                    INNER JOIN country co ON j.country_id = co.country_id \
                    INNER JOIN state s ON j.state_id = s.state_id \
                    INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                    INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                    INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id \
                    WHERE j.job_id IN (5615, 5614, 5613, 5612, 5611, 5610, 5609, 5608) \
                    AND j.application_deadline >= CURDATE() \
                    AND j.is_approved = '${config.true}' \
                    AND j.is_deleted = '${config.false}' \
                    ORDER BY j.date_created DESC`;

        return sql;
    }

    static getAllIndustries() {
        var sql = `SELECT * FROM industry ORDER BY industry_name`;

        return sql;
    }

    static getAllStates() {
        var sql = `SELECT * FROM state ORDER BY state_name`;

        return sql;
    }

    static getAllNGStates() {
        var sql = `SELECT * FROM state WHERE country_id = 161 ORDER BY state_name `;

        return sql;
    }

    static getAllStatesByCountry(country_id) {
        var sql = `SELECT * FROM state WHERE country_id = ${country_id} ORDER BY state_name`;

        return sql;
    }

    static getAllQualifications() {
        var sql = `SELECT * FROM qualification ORDER BY qualification_name`;

        return sql;
    }

    static getAllExperienceLevel() {
        var sql = `SELECT * FROM experience_level ORDER BY experience_level_name`;

        return sql;
    }

    static getAllSpecialization() {
        var sql = `SELECT * FROM specialization ORDER BY specialization_name`;

        return sql;
    }

    static getAllSkill() {
        var sql = `SELECT skill_name AS label, value FROM skill ORDER BY skill_name`;

        return sql;
    }

    static getAllShortlistParams() {
        var sql = `SELECT param_name AS label, value FROM shortlist_params`;

        return sql;
    }

    static getAllPostedJobsToBeAssigned(user_id) {
        var sql = `SELECT job_name AS label, job_id AS value FROM job WHERE posted_by = ${user_id} \
                AND is_deleted = ${config.false}`;

        return sql;
    }

    static getAllApplicationStatus() {
        var sql = `SELECT * FROM application_status ORDER BY status_name`;

        return sql;
    }

    static getAllCandidateJobApplications(user_id) {
        var sql = `SELECT a.application_id, a.date_created, j.job_id, j.job_name, \
                (SELECT aps.status_name FROM application_status aps WHERE \
                aps.application_status_id = a.application_status) AS application_status, \
                (SELECT c.company_name FROM company c WHERE c.company_id = j.company_id) AS company_name, \
                (SELECT jt.job_type_name FROM job_type jt WHERE jt.job_type_id = j.job_type_id) AS job_type \
                FROM application a INNER JOIN job j ON j.job_id = a.job_id \
                WHERE a.user_id = ${user_id} ORDER BY a.date_created DESC`;

        return sql;
    }

    static getCandidateApplicationStatus(candidate_id, job_id) {
        var sql = `SELECT * FROM application a WHERE a.user_id = ${candidate_id} \
                AND a.job_id = ${job_id}`;

        return sql;
    }

    static getAllCandidateApplications(candidate_id) {
        var sql = `SELECT j.job_name, a.date_created, a.application_status FROM user u \
                    INNER JOIN application a ON a.user_id = u.user_id \
                    INNER JOIN job j ON j.job_id = a.job_id \
                    WHERE u.user_id = ${candidate_id}`;

        return sql;
    }

    static setApplicationStatus(applicant_status, personal_message, candidate_id, job_id) {
        var sql = `UPDATE application SET application_status = '${applicant_status}', \
                personal_message = '${personal_message}' WHERE job_id = ${job_id} AND \
                user_id = ${candidate_id}`;

        return sql;
    }

    static getAllCountries() {
        var sql = `SELECT * FROM country ORDER BY country_name`;

        return sql;
    }

    static getAllJobTypes() {
        var sql = `SELECT * FROM job_type ORDER BY job_type_name`;

        return sql;
    }

    static getAllJobCategories() {
        var sql = `SELECT * FROM job_category ORDER BY job_category_name`;

        return sql;
    }

    static getAllSkills() {
        var sql = `SELECT * FROM skill ORDER BY skill_name`;

        return sql;
    }

    getFilterJobsProcessQuery(industry_params, skills_params, state_params, job_type_params, job_category_params) {
        var sql = `SELECT j.*, c.company_name, co.country_name, s.state_name, jc.job_category_name, \
                jt.job_type_name, el.experience_level_name FROM job j \
                INNER JOIN company c ON j.company_id = c.company_id \
                INNER JOIN country co ON j.country_id = co.country_id \
                INNER JOIN state s ON j.state_id = s.state_id \
                INNER JOIN job_category jc ON j.job_category_id = jc.job_category_id \
                INNER JOIN job_type jt ON j.job_type_id = jt.job_type_id \
                INNER JOIN experience_level el ON j.experience_level_id = el.experience_level_id \
                WHERE j.is_deleted = ${config.false} AND j.is_approved = ${config.true} \
                AND j.application_deadline >= CURDATE()`;

        if (typeof industry_params == 'undefined') {
            sql += '';
        } else {
            sql += ' AND c.industry IN (' + industry_params.join() + ')';
        }

        if (typeof skills_params == 'undefined') {
            sql += '';
        } else {
            sql += '';
        }

        if (typeof state_params == 'undefined') {
            sql += '';
        } else {
            sql += ' AND j.state_id IN (' + state_params.join() + ')';
        }

        if (typeof job_type_params == 'undefined') {
            sql += '';
        } else {
            sql += ' AND j.job_type_id IN (' + job_type_params.join() + ')';
        }

        if (typeof job_category_params == 'undefined') {
            sql += '';
        } else {
            sql += ' AND j.job_category_id IN (' + job_category_params.join() + ')';
        }

        sql += ' ORDER BY j.date_created DESC';

        return sql;
    }

    processJobsByQualification(all_recommended_jobs_array, recommended_jobs_by_qualification) {
        for (var i = 0; i < recommended_jobs_by_qualification.length; i++) {
            if (!removeDuplicateJobs(all_recommended_jobs_array, recommended_jobs_by_qualification[i])) {
                all_recommended_jobs_array.push(recommended_jobs_by_qualification[i]);
            }

        }
        logger.log(recommended_jobs_by_qualification)
        return all_recommended_jobs_array;
    }

    removeDuplicateJobs(mainArray, secondaryArray) {
        return mainArray.includes(secondaryArray);
    }

    searchTagline(param) {
        var sql = `SELECT DISTINCT u.* FROM user u \
                WHERE LOWER(u.tagline) LIKE LOWER('%${param}%')`;

        return sql;
    }

    searchWERolename(param) {
        var sql = `SELECT DISTINCT u.* FROM user u
                WHERE u.user_id IN (SELECT we.user_id FROM \
                work_experience we WHERE LOWER(we.job_title) \
                LIKE LOWER('%${param}%'))`;

        return sql;
    }

    searchState(param) {
        var sql = `SELECT DISTINCT u.* FROM user u \ 
                WHERE u.state IN (${param})`;

        return sql;
    }

    searchCountry(param) {
        var sql = `SELECT DISTINCT u.* FROM user u \ 
                WHERE u.country IN (${param})`;

        return sql;
    }

    searchQualification(param) {
        var sql = `SELECT DISTINCT u.* FROM user u \
                WHERE u.user_id IN (SELECT e.user_id FROM \
                education e WHERE e.qualification = ${param})`;

        return sql;
    }

    searchSkill(param) {
        var sql = `SELECT DISTINCT u.* FROM user u WHERE u.user_id IN \
                (SELECT rs.user_id FROM resume_skill rs WHERE rs.skill_id IN \
                (SELECT s.skill_id FROM skill s WHERE LOWER(s.skill_name) \
                LIKE LOWER('%${param}%')))`;

        return sql;
    }

    searchIndustry(param) {
        var sql = `SELECT DISTINCT u.* FROM user u \
                WHERE u.user_id IN (SELECT e.user_id FROM \
                education e WHERE e.qualification IN (${param}))`;

        return sql;
    }

    searchCompany(param) {
        var sql = `SELECT DISTINCT u.* FROM user u WHERE u.company IN (SELECT c.company_id \
                FROM company c WHERE LOWER(c.company_name) LIKE LOWER('%${param}%'))`;

        return sql;
    }

    searchEducationName(param) {
        var sql = `SELECT DISTINCT u.* FROM user u WHERE u.user_id IN \
                (SELECT e.user_id FROM education e WHERE LOWER(e.name_of_institution) \
                LIKE LOWER('%${param}%'))`;

        return sql;
    }

    searchTalentPool(job_title_param, keyword_param, location_param, education_level_param) {
        var sql = `SELECT DISTINCT u.user_id, u.user_uuid, u.first_name, u.last_name, u.tagline, u.photo_url, \
                 r.profile_summary FROM user u INNER JOIN resume r ON r.user_id = u.user_id \
                 WHERE u.is_deleted = 0`;

        if (typeof job_title_param != 'undefined' && job_title_param && job_title_param != '') {
            sql += ` AND \
                    (LOWER(u.tagline) LIKE LOWER('%${job_title_param}%') \
                    OR \
                    u.user_id IN (SELECT we.user_id FROM work_experience we WHERE LOWER(we.job_title) \
                    LIKE LOWER('%${job_title_param}%'))
                    OR \
                    u.user_id IN (SELECT r.user_id FROM resume r WHERE LOWER(r.profile_summary) \
                    LIKE LOWER('%${job_title_param}%')))`;
        }

        if (typeof keyword_param != 'undefined' && keyword_param && keyword_param != '') {
            sql += ` AND \
                    (u.user_id IN (SELECT e.user_id FROM education e WHERE LOWER(e.name_of_institution) \
                    LIKE LOWER('%${keyword_param}%')) \
                    OR \
                    u.user_id IN (SELECT rs.user_id FROM resume_skill rs WHERE rs.skill_id IN \
                    (SELECT s.skill_id FROM skill s WHERE LOWER(s.skill_name) LIKE LOWER('%${keyword_param}%'))))`;
        }

        if (typeof location_param != 'undefined' && location_param && location_param != '') {
            sql += ` AND \
                    (u.state IN (${location_param}) \
                    OR \
                    u.country IN (${location_param}))`;
        }

        if (typeof education_level_param != 'undefined' && education_level_param && education_level_param != '') {
            sql += ` AND \
                     u.user_id IN (SELECT e.user_id FROM education e WHERE e.qualification IN (${education_level_param}))`;
        }




        return sql;
    }

    percentageMatchProcess(user_id, job_id) {
        var qualification_score = 10;
        var experience_score = 10;
        var gender_score = 10;
        var age_score = 10;

        var total_score = 0;

        var qualification_sql = `SELECT job.min_qualification, education.qualification, \
            education.qualification_grade FROM job AS job, education AS education \
            WHERE job.job_id = ${job_id} AND education.user_id = ${user_id}`;

        db.query(qualification_sql, (err, data) => {
            if (!err) {
                var job_min_qualification = data[0].min_qualification;

                var user_qualifications = [];
                var user_qualification_grade = [];

                for (var i = 0; i < data.length; i++) {
                    user_qualifications.push(parseInt(data[i].qualification));
                    user_qualification_grade.push(data[i].qualification_grade);
                }

                var highest_user_qualification = Math.max.apply(Math, user_qualifications);

                if (highest_user_qualification >= job_min_qualification) {
                    total_score += qualification_score;
                }


                var experience_sql = `SELECT WE.start_date, WE.end_date, WE.user_id, \
                    job.min_year_of_experience, job.max_year_of_experience FROM work_experience AS WE, \
                    job AS job WHERE job.job_id = ${job_id} AND WE.user_id = ${user_id}`;

                db.query(experience_sql, (err, data) => {
                    if (!err) {
                        var job_min_year_of_experience = parseInt(data[0].min_year_of_experience);
                        var job_max_year_of_experience = parseInt(data[0].max_year_of_experience);

                        var no_of_years = [];
                        var users_total_no_of_experience = 0;

                        for (var i = 0; i < data.length; i++) {
                            var start_date = moment(data[i].start_date, 'YYYY-MM-DD');
                            var end_date = moment(data[i].end_date, 'YYYY-MM-DD');

                            no_of_years.push(this.calculateYearBetweenTwoDates(start_date, end_date));
                            users_total_no_of_experience += no_of_years[i];
                        }

                        if (users_total_no_of_experience >= job_min_year_of_experience &&
                            users_total_no_of_experience <= job_max_year_of_experience) {

                            total_score += experience_score;
                        }


                        var gender_sql = `SELECT user.gender, job.gender_type FROM user, job WHERE job_id = ${job_id} AND user_id = ${user_id}`;

                        db.query(gender_sql, (err, data) => {
                            if (!err) {
                                var user_gender = data[0].gender;
                                var job_gender_type = data[0].gender_type;

                                if (job_gender_type === config.gender_status_all) {
                                    total_score += gender_score;
                                } else if (user_gender === job_gender_type) {
                                    total_score += gender_score;
                                }


                                var age_sql = `SELECT user.dob AS dob, job.min_age, job.max_age FROM user AS user, \
                                    job AS job WHERE user.user_id = ${user_id} AND job.job_id = ${job_id}`;

                                db.query(age_sql, (err, data) => {

                                    if (!err) {
                                        var dob = data[0].dob;

                                        if (typeof dob != 'undefined' || dob != 'null' || dob != '' || dob != null) {
                                            var user_age = this.calculateAgeFromDOB(data[0].dob);

                                            var min_age = data[0].min_age;
                                            var max_age = data[0].max_age;

                                            if (user_age >= min_age && user_age <= max_age) {
                                                total_score += age_score;
                                            }
                                        }
                                    }

                                    return total_score;
                                });
                            }
                        });
                    }
                });

            }
        });

    }

    getTotalNumberOfJobsPosted() {
        var sql = `SELECT COUNT(*) AS total_no_of_jobs FROM job WHERE is_approved = 1`;

        return sql;
    }

    getTotalNumberOfJobsPostedThisWeek() {
        var weekStartDate = helper.getDateofDayofTheWeek(0);

        var weekEndDate = helper.getDateofDayofTheWeek(6);

        var sql = `SELECT COUNT(*) AS no_of_jobs_posted_this_week FROM job \
                WHERE is_approved = 1 AND date_created > '${weekStartDate}' AND date_created <= '${weekEndDate}'`;

        return sql;
    }

    getTotalNumberOfActiveJobs() {
        var current_date = moment(this.getCurrentTimeStamp()).format('YYYY-MM-DD');

        var sql = `SELECT COUNT(*) AS no_of_active_jobs FROM job WHERE is_approved = 1 \
                    AND application_deadline > '${current_date}'`;

        return sql;
    }

    getTotalNumberOfExpiredJobs() {
        var current_date = moment(this.getCurrentTimeStamp()).format('YYYY-MM-DD');

        var sql = `SELECT COUNT(*) AS no_of_expired_jobs FROM job WHERE is_approved = 1 \
                    AND application_deadline < '${current_date}'`;

        return sql;
    }

    getTotalNumberOfJobApplications() {
        var sql = `SELECT COUNT(*) AS total_no_of_applications FROM application`;

        return sql;
    }

    getTotalNumberOfJobApplicationsThisWeek() {
        var weekStartDate = helper.getDateofDayofTheWeek(0);

        var weekEndDate = helper.getDateofDayofTheWeek(6);

        var sql = `SELECT COUNT(*) AS no_of_applications_this_week FROM application \
                WHERE date_created > '${weekStartDate}' AND date_created <= '${weekEndDate}'`;

        return sql;
    }

    getJobNameWithRecruiterData(job_id) {
        var sql = `SELECT job_name, u.first_name, u.last_name, u.email FROM job j \
                INNER JOIN user u ON u.user_id = j.posted_by WHERE j.job_id = ${job_id}`;

        return sql;
    }
}

module.exports = Job;