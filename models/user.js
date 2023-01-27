var dateTime = require('node-datetime');
var bcrypt = require('bcryptjs');
var config = require('../config/config');
var helper = require('../config/helpers');

class User {

    constructor() {}

    createUserQuery(user_uuid, first_name, last_name, username, other_name, email, phone_number, gender,
        dob, profile_completeness, photo_url, social_media_id, tagline, password, is_activated, means_of_id_url,
        recruiter_class, plan_type, state, country, highest_qualification, industry, years_of_experience) {

        'use strict';

        user_uuid = helper.checkifUndefined(user_uuid);
        first_name = helper.checkifUndefined(first_name);
        last_name = helper.checkifUndefined(last_name);
        username = helper.checkifUndefined(username);
        other_name = helper.checkifUndefined(other_name);
        email = helper.checkifUndefined(email);
        phone_number = helper.checkifUndefined(phone_number);
        profile_completeness = helper.checkifUndefined(profile_completeness);
        photo_url = helper.checkifUndefined(photo_url);
        social_media_id = helper.checkifUndefined(social_media_id);
        tagline = helper.checkifUndefined(tagline);
        password = helper.checkifUndefined(password);
        is_activated = helper.checkifUndefined(is_activated);
        means_of_id_url = helper.checkifUndefined(means_of_id_url);
        recruiter_class = helper.checkifUndefined(recruiter_class);
        plan_type = helper.checkifUndefined(plan_type);

        gender = helper.checkifUndefined(gender);
        dob = helper.checkifUndefined(dob);
        state = helper.checkifUndefined(state);
        country = helper.checkifUndefined(country);
        highest_qualification = helper.checkifUndefined(highest_qualification);
        industry = helper.checkifUndefined(industry);
        years_of_experience = helper.checkifUndefined(years_of_experience);

        var is_approved = config.false;
        var is_deleted = config.false;

        var date_created = this.getCurrentTimeStamp();

        password = bcrypt.hashSync(password, config.salt_rounds);

        var sql = `INSERT INTO user(user_uuid, first_name, last_name, username, other_name, email, phone_number, gender, \
        dob, profile_completeness, photo_url, social_media_id, tagline, password, date_created, is_activated, is_first_login, \
        plan_type, means_of_id_url, recruiter_class, is_deleted, is_approved, state, country, highest_qualification, industry, \
        years_of_experience) VALUES ('${user_uuid}',\
        '${first_name}', '${last_name}', '${username}','${other_name}', '${email}', '${phone_number}', '${gender}',\
        '${dob}', '${profile_completeness}', '${photo_url}', '${social_media_id}', '${tagline}', '${password}',\
        '${date_created}', '${is_activated}', '${config.true}', ${plan_type}, '${means_of_id_url}', '${recruiter_class}', \
        ${is_deleted}, ${is_approved}, ${state}, ${country}, ${highest_qualification}, ${industry}, '${years_of_experience}')`;

        return sql;
    }

    createTeammateQuery(user_uuid, first_name, last_name, username, other_name, email, phone_number, gender,
        dob, profile_completeness, photo_url, social_media_id, tagline, password, is_activated, company_id) {

        'use strict';

        user_uuid = helper.checkifUndefined(user_uuid);
        first_name = helper.checkifUndefined(first_name);
        last_name = helper.checkifUndefined(last_name);
        username = helper.checkifUndefined(username);
        other_name = helper.checkifUndefined(other_name);
        email = helper.checkifUndefined(email);
        phone_number = helper.checkifUndefined(phone_number);
        gender = helper.checkifUndefined(gender);
        dob = helper.checkifUndefined(dob);
        profile_completeness = helper.checkifUndefined(profile_completeness);
        photo_url = helper.checkifUndefined(photo_url);
        social_media_id = helper.checkifUndefined(social_media_id);
        tagline = helper.checkifUndefined(tagline);
        password = helper.checkifUndefined(password);
        is_activated = helper.checkifUndefined(is_activated);

        var date_created = this.getCurrentTimeStamp();

        password = bcrypt.hashSync(password, config.salt_rounds);

        var sql = `INSERT INTO user(user_uuid, first_name, last_name, username, other_name, email, phone_number, gender, \
        dob, profile_completeness, photo_url, social_media_id, tagline, password, date_created, is_activated, is_first_login,\
        company, is_password_set) VALUES ('${user_uuid}',\
        '${first_name}', '${last_name}', '${username}','${other_name}', '${email}', '${phone_number}', '${gender}',\
        '${dob}', '${profile_completeness}', '${photo_url}', '${social_media_id}', '${tagline}', '${password}',\
        '${date_created}', '${is_activated}', '${config.false}', ${company_id}, '${config.false}')`;

        return sql;
    }

    createCompanyQuery(company_name, industry, no_of_employees, year_established, type_of_employer, rc_number,
        facebook_link, instagram_link, twitter_link, google_plus_link, youtube_channel_link, linkedin_link, website,
        address, country, state, company_phone_number, company_email, company_logo, company_banner_img_url,
        certificate_of_incorp_url, created_by) {

        company_name = helper.checkifUndefined(company_name);
        industry = helper.checkifUndefined(industry);
        no_of_employees = helper.checkifUndefined(no_of_employees);
        year_established = helper.checkifUndefined(year_established);
        type_of_employer = helper.checkifUndefined(type_of_employer);
        rc_number = helper.checkifUndefined(rc_number);
        facebook_link = helper.checkifUndefined(facebook_link);
        twitter_link = helper.checkifUndefined(twitter_link);
        instagram_link = helper.checkifUndefined(instagram_link);
        google_plus_link = helper.checkifUndefined(google_plus_link);
        linkedin_link = helper.checkifUndefined(linkedin_link);
        youtube_channel_link = helper.checkifUndefined(youtube_channel_link);
        company_phone_number = helper.checkifUndefined(company_phone_number);
        company_email = helper.checkifUndefined(company_email);
        website = helper.checkifUndefined(website);
        country = helper.checkifUndefined(country);
        address = helper.checkifUndefined(address);
        state = helper.checkifUndefined(state);
        company_banner_img_url = helper.checkifUndefined(company_banner_img_url);
        company_logo = helper.checkifUndefined(company_logo);
        certificate_of_incorp_url = helper.checkifUndefined(certificate_of_incorp_url);

        var date_created = this.getCurrentTimeStamp();

        var sql = `INSERT INTO company(company_name, industry, no_of_employees, year_established, type_of_employer,\
         rc_number, facebook_link, instagram_link, twitter_link, google_plus_link, youtube_channel_link, linkedin_link,\
         website, address, country, state, company_phone_number, company_email, company_logo_url, date_created, \
         company_banner_img_url, certificate_of_incorp_url, created_by) VALUES ('${company_name}', ${industry}, '${no_of_employees}', \
         '${year_established}', '${type_of_employer}', '${rc_number}', '${facebook_link}', '${instagram_link}', '${twitter_link}', \
         '${google_plus_link}', '${youtube_channel_link}', '${linkedin_link}', '${website}', '${address}', ${country}, \
         ${state}, '${company_phone_number}', '${company_email}', '${company_logo}', '${date_created}', \
         '${company_banner_img_url}', '${certificate_of_incorp_url}', ${created_by})`;

        return sql;
    }

    static insertUserRole(user_id, role_id) {
        var sql = `INSERT INTO user_role(user_id, role_id) VALUES (${user_id}, ${role_id})`;
        return sql;
    }

    static addCompanyToRecruiter(user_id, company_id) {
        var sql = `UPDATE user SET company = ${company_id} WHERE user_id = ${user_id}`;
        return sql;
    }

    updateCandidateQuery(user_id, first_name, last_name, email, phone_number, address,
        gender, dob, tagline, state, country, industry) {

        first_name = helper.checkifUndefined(first_name);
        last_name = helper.checkifUndefined(last_name);
        email = helper.checkifUndefined(email);
        phone_number = helper.checkifUndefined(phone_number);
        address = helper.checkifUndefined(address);
        gender = helper.checkifUndefined(gender);
        dob = helper.checkifUndefined(dob);
        tagline = helper.checkifUndefined(tagline);
        industry = helper.checkifUndefined(industry);

        state = (typeof state === 'undefined') && (state == 'null') && (state == null) && (state == '') ? 0 : state;
        country = (typeof country === 'undefined') && (country == 'null') && (country == null) && (country == '') ? 0 : country;

        var sql = `UPDATE user SET first_name='${first_name}', last_name='${last_name}',\
            email='${email}', phone_number='${phone_number}', address='${address}', \
            gender='${gender}', dob='${dob}', tagline='${tagline}', state=${state}, \
            country=${country}, industry=${industry} WHERE user_id = ${user_id}`;

        return sql;
    }

    updateRecruiterQuery(user_id, first_name, last_name, email, phone_number) {

        first_name = helper.checkifUndefined(first_name);
        last_name = helper.checkifUndefined(last_name);
        email = helper.checkifUndefined(email);
        phone_number = helper.checkifUndefined(phone_number);

        var sql = `UPDATE user SET first_name='${first_name}', last_name='${last_name}',\
                email='${email}', phone_number='${phone_number}' WHERE user_id = ${user_id}`;

        return sql;
    }

    updateRecruiterCompany(company_id, company_name, rc_number, industry, no_of_employees, year_established, type_of_employer,
        facebook_link, instagram_link, twitter_link, google_plus_link, linkedin_link, youtube_channel_link, phone_number,
        company_email, website, country, address, city, state, company_logo_url, company_banner_img_url,
        company_description) {

        company_name = helper.checkifUndefined(company_name);
        rc_number = helper.checkifUndefined(rc_number);
        industry = helper.checkifUndefined(industry)
        no_of_employees = helper.checkifUndefined(no_of_employees);
        year_established = helper.checkifUndefined(year_established);
        type_of_employer = helper.checkifUndefined(type_of_employer);
        facebook_link = helper.checkifUndefined(facebook_link);
        instagram_link = helper.checkifUndefined(instagram_link);
        twitter_link = helper.checkifUndefined(twitter_link);
        google_plus_link = helper.checkifUndefined(google_plus_link);
        linkedin_link = helper.checkifUndefined(linkedin_link);
        youtube_channel_link = helper.checkifUndefined(youtube_channel_link);
        phone_number = helper.checkifUndefined(phone_number);
        company_email = helper.checkifUndefined(company_email);
        website = helper.checkifUndefined(website);
        country = helper.checkifUndefined(country);
        address = helper.checkifUndefined(address);
        city = helper.checkifUndefined(city);
        state = helper.checkifUndefined(state);
        company_logo_url = helper.checkifUndefined(company_logo_url);
        company_banner_img_url = helper.checkifUndefined(company_banner_img_url);

        company_description = helper.escapeString(company_description);
        company_description = helper.checkifUndefined(company_description);


        var sql = `UPDATE company SET company_name = '${company_name}', industry = ${industry}, \
            no_of_employees = '${no_of_employees}', year_established = '${year_established}', \
            type_of_employer = '${type_of_employer}', rc_number = '${rc_number}', \
            facebook_link = '${facebook_link}', instagram_link = '${instagram_link}', \
            twitter_link = '${twitter_link}', google_plus_link = '${google_plus_link}', \
            youtube_channel_link = '${youtube_channel_link}', linkedin_link = '${linkedin_link}',\
            website = '${website}', address = '${address}', city = '${city}', country = ${country}, \
            state = ${state}, company_phone_number = '${phone_number}',company_email = '${company_email}', \
            company_logo_url = '${company_logo_url}', company_banner_img_url = '${company_banner_img_url}', \
            company_description = '${company_description}' WHERE company_id = ${company_id}`;

        return sql;
    }

    updateRecruiterSubscriptionPlanQuery(user_id, plan_type, plan_upgrade_date, subscription_due_date) {
        var sql = `UPDATE user SET plan_type = ${plan_type}, plan_upgrade_date = '${plan_upgrade_date}', \
                    subscription_due_date = '${subscription_due_date}' WHERE user_id = ${user_id}`;

        return sql;
    }

    static updatePasswordQuery(user_id, password) {
        password = bcrypt.hashSync(password, config.salt_rounds);

        var sql = `UPDATE user SET password='${password}' WHERE user_id = ${user_id}`;

        return sql;
    }

    static updateInvitedUserInfo(user_id, first_name, last_name, password) {
        password = bcrypt.hashSync(password, config.salt_rounds);

        var sql = `UPDATE user SET first_name = '${first_name}', last_name = '${last_name}', \
                password='${password}' WHERE user_id = ${user_id}`;

        return sql;
    }

    static updatePasswordForUser(user_id, password) {
        password = bcrypt.hashSync(password, config.salt_rounds);

        var sql = `UPDATE user SET password='${password}' WHERE user_id = ${user_id}`;

        return sql;
    }

    static getUserPasswordQuery(user_id) {
        var sql = `SELECT password FROM user WHERE user_id = ${user_id}`

        return sql;
    }

    static getUserByIdQuery(user_id) {
        var sql = `SELECT * FROM user WHERE user_id = ${user_id}`;
        return sql;
    }

    static checkIfUserExistsBySocialMediaId(social_media_id) {
        var sql = `SELECT * FROM user WHERE social_media_id = ${social_media_id}`;
        return sql;
    }

    static checkIfEmailExist(email) {
        var sql = `SELECT u.user_id, u.first_name, u.last_name, u.password, ur.role_id FROM \
            user u, user_role ur WHERE LOWER(email) = LOWER('${email}') AND u.user_id = ur.user_id`;

        return sql;
    }

    static getCandidateData(user_id) {
        var sql = `SELECT u.*, ur.role_id, r.resume_id FROM user u, user_role ur, resume r \
            WHERE u.user_id = ${user_id} AND u.user_id = ur.user_id \
            AND u.user_id = r.user_id`;

        return sql;
    }

    static getAdminData(user_id) {
        var sql = `SELECT u.*, ur.role_id, c.company_id, c.company_name FROM \
            user u, user_role ur, company c WHERE u.user_id = ${user_id} \ 
            AND u.user_id = ur.user_id AND u.company = c.company_id`;

        return sql;
    }

    static getRecruiterData(user_id) {
        var sql = `SELECT u.*, ur.role_id, c.company_id, c.company_name FROM \
            user u, user_role ur, company c WHERE u.user_id = ${user_id} \
            AND u.user_id = ur.user_id AND u.company = c.company_id`;

        return sql;
    }

    static getUserRoleByUserId(user_id) {
        var sql = `SELECT role_id FROM user_role WHERE user_id = ${user_id}`;

        return sql;
    }

    static loginQuery(email) {
        var sql = `SELECT u.*, ur.role_id FROM user u, user_role ur WHERE u.email = '${email}' \
        AND ur.user_id = u.user_id`;

        return sql;
    }

    static addPasswordTokenToUser(user_id, token) {
        var sql = `UPDATE user SET token = '${token}' WHERE user_id = ${user_id}`;
        return sql;
    }

    static deleteUserByIdQuery(user_id) {
        var sql = `DELETE FROM user WHERE user_id = ${user_id}`;
        return sql;
    }

    static getAllUsersQuery() {
        var sql = `SELECT * FROM user`;
        return sql;
    }

    static loginQuery(email, password) {
        var sql = `SELECT * FROM user WHERE email = '${email}' AND password = '${password}'`;
        return sql;
    }

    static saveUserActivationToken(user_id, token) {
        var sql = `UPDATE user SET activation_token = '${token}' WHERE user_id = ${user_id}`;

        return sql;
    }

    compareUserActivationToken(user_id, token) {
        var sql = `SELECT * FROM user WHERE activation_token = '${token}' AND user_id = ${user_id}`;

        return sql;
    }

    activateUser(user_id) {
        var sql = `UPDATE user SET is_activated ='1' WHERE user_id = ${user_id}`;

        return sql;
    }

    getUserActivityHistory(user_id) {
        var sql = `SELECT * FROM activity_trail WHERE user_id = ${user_id} \
                    ORDER BY date_created DESC LIMIT 7`;

        return sql;
    }

    getCountOfCandidateApplications(user_id) {
        var sql = `SELECT COUNT(*) AS count FROM application WHERE user_id = ${user_id}`;

        return sql;
    }

    getCountOfCandidateSavedJobs(user_id) {
        var sql = `SELECT COUNT(*) AS count FROM saved_jobs WHERE saved_by = ${user_id}`;

        return sql;
    }

    getCountOfJobOpenings(user_id) {
        var sql = `SELECT COUNT(*) AS count FROM job WHERE posted_by = ${user_id}\
                 AND is_deleted = ${config.false}`;

        return sql;
    }

    getCountOfTotalQualifiedCandidates(user_id) {
        var sql = `SELECT COUNT(*) AS count FROM application WHERE job_id IN (SELECT job_id FROM\
                 job WHERE posted_by = ${user_id}) AND application_status = '${config.shortlisted}'`;

        return sql;
    }

    getCountOfRecruiterSavedCandidates(user_id) {
        var sql = `SELECT COUNT(*) AS count FROM saved_resumes WHERE user_id = ${user_id}`;

        return sql;
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

    updateResumeFileUrlQuery(user_id, resume_id, resume_url) {
        var sql = `UPDATE resume SET resume_file_url = '${resume_url}' WHERE resume_id = ${resume_id} \
                    AND user_id = ${user_id}`;

        return sql;
    }

    updateProfilePicQuery(user_id, photo_url) {
        var sql = `UPDATE user SET photo_url = '${photo_url}' WHERE user_id = ${user_id}`;

        return sql;
    }

    static getAllCompanyTeamMembersByCompanyId(company_id) {
        var sql = `SELECT u.*, ur.role_id, r.role_name FROM user u, user_role ur \
                    INNER JOIN role r ON ur.role_id = r.role_id \
                    WHERE u.company = ${company_id} AND u.user_id = ur.user_id`;

        return sql;
    }

    static getUserByInviteToken(invite_token) {
        var sql = `SELECT u.*, ur.role_id FROM user u, user_role ur WHERE invite_token = '${invite_token}' \
                AND u.user_id = ur.user_id`;
        return sql;
    }

    static getUserByPasswordResetToken(password_reset_token) {
        var sql = `SELECT u.*, ur.role_id FROM user u, user_role ur WHERE password_reset_token = '${password_reset_token}' \
                AND u.user_id = ur.user_id`;
        return sql;
    }

    saveInviteToken(recipient_email, token) {
        var sql = `UPDATE user SET invite_token = '${token}', is_invite_token_active = ${config.true} \
                WHERE email = '${recipient_email}'`;
        return sql;
    }

    deactivateInviteToken(user_id) {
        var sql = `UPDATE user SET is_invite_token_active = ${config.false} WHERE user_id = ${user_id}`;
        return sql;
    }

    deactivatePasswordResetToken(user_id) {
        var sql = `UPDATE user SET is_password_reset_token_active = ${config.false} WHERE user_id = ${user_id}`;
        return sql;
    }

    getAllActiveCandidates() {
        var sql = `SELECT u.user_id, u.first_name, u.last_name, u.email \
                FROM user u WHERE \
                (SELECT ur.role_id FROM user_role ur WHERE ur.user_id = u.user_id) = 1`;

        return sql;
    }

    getAllRecruitersSavedCandidates(user_id) {
        var sql = `SELECT sr.saved_resume_id, u.*, r.* FROM saved_resumes sr \
            INNER JOIN user u ON sr.user_id = u.user_id \
            INNER JOIN resume r ON sr.resume_id = r.resume_id \
            WHERE sr.created_by = ${user_id}`;

        return sql;
    }

    getAllCandidatesSavedJobs(user_id) {
        var sql = `SELECT sj.saved_job_id, j.job_id, j.job_name, \
                (SELECT c.company_name FROM company c WHERE c.company_id = j.company_id) AS company_name, \
                (SELECT cty.country_name FROM country cty WHERE cty.country_id = j.country_id) AS country, \
                (SELECT s.state_name FROM state s WHERE s.state_id = j.state_id) AS state, \
                (SELECT jt.job_type_name FROM job_type jt WHERE jt.job_type_id = j.job_type_id) AS job_type, \
                (SELECT jc.job_category_name FROM job_category jc WHERE jc.job_category_id = j.job_category_id) AS job_category \
                FROM saved_jobs sj \
                INNER JOIN job j ON sj.job_id = j.job_id \
                WHERE sj.saved_by = ${user_id}`;

        return sql;
    }

    removeSavedCandidate(saved_resume_id) {
        var sql = `DELETE FROM saved_resumes WHERE saved_resume_id = ${saved_resume_id}`;

        return sql;
    }

    removeSavedCandidateOld(candidate_id, recruiter_user_id) {
        var sql = `DELETE FROM saved_resumes WHERE user_id = ${candidate_id} \
            AND created_by = ${recruiter_user_id}`;

        return sql;
    }

    saveCandidate(resume_id, candidate_id, recruiter_id) {
        var date_created = this.getCurrentTimeStamp();

        var sql = `INSERT INTO saved_resumes(resume_id, user_id, created_by, date_created) VALUES \
                    (${resume_id}, ${candidate_id}, ${recruiter_id}, '${date_created}')`;

        return sql;
    }

    getAllRecruitersInterviews(user_id) {
        var sql = `SELECT i.*, \
            (SELECT COUNT(*) FROM application a WHERE a.job_id = i.job_id \
            AND a.application_status = ${config.ap_status_shortlisted}) AS no_of_candidates \
            FROM interview i WHERE i.created_by = ${user_id} \
            ORDER BY i.date_created DESC`;

        return sql;
    }

    getInterviewByInterviewId(interviewId) {
        var sql = `SELECT * FROM interview WHERE interview_id = ${interviewId}`;

        return sql;
    }

    getAllCandidatesForInterview(interview_id, job_id) {
        var sql = `SELECT a.*, u.*, j.*, a.date_created AS application_date \
                FROM application a \
                INNER JOIN job j ON a.job_id = j.job_id \
                INNER JOIN user u ON a.user_id = u.user_id \
                WHERE a.job_id = ${job_id} \
                AND a.application_status = ${config.ap_status_shortlisted}`;

        return sql;
    }

    getAllCandidates() {
        var sql = `SELECT u.* FROM user u WHERE u.user_id IN \
                    (SELECT ur.user_id FROM user_role ur WHERE ur.role_id = ${config.candidate_role_tag})`;

        return sql;
    }

    getAllRecruiters() {
        var sql = `SELECT u.*, c.* FROM user u INNER JOIN company c ON c.created_by = u.user_id \
                    WHERE u.user_id IN (SELECT ur.user_id FROM user_role ur WHERE ur.role_id = ${config.recruiter_admin_role_tag})`;

        return sql;
    }


    createInterview(interview_name, interview_date, interview_time, venue, link_to_virtual_meeting,
        dress_code, job_assigned_to, interview_description, user_id) {

        interview_name = helper.checkifUndefined(interview_name);
        interview_date = helper.checkifUndefined(interview_date);
        interview_time = helper.checkifUndefined(interview_time);
        venue = helper.checkifUndefined(venue);
        link_to_virtual_meeting = helper.checkifUndefined(link_to_virtual_meeting);
        dress_code = helper.checkifUndefined(dress_code);
        job_assigned_to = helper.checkifUndefined(job_assigned_to);

        //interview_description = helper.escapeString(interview_description);
        interview_description = helper.checkifUndefined(interview_description);

        interview_date = helper.formatDateToDatetime(interview_date);

        var date_created = helper.getCurrentTimeStamp();

        var sql = `INSERT INTO interview(interview_name, interview_date, interview_time, venue, link_to_virtual_meeting, \
            dress_code, description, job_id, created_by, is_deleted, status, date_created) VALUES ('${interview_name}', \
            '${interview_date}', '${interview_time}', '${venue}', '${link_to_virtual_meeting}', '${dress_code}', \
            '${interview_description}', ${job_assigned_to}, ${user_id}, ${config.false}, '${config.opened}', '${date_created}')`;

        return sql;
    }

    updateInterview(interview_id, interview_name, interview_date, interview_time, venue, link_to_virtual_meeting,
        dress_code, job_assigned_to, interview_description, user_id) {

        interview_name = helper.checkifUndefined(interview_name);
        interview_date = helper.checkifUndefined(interview_date);
        interview_time = helper.checkifUndefined(interview_time);
        venue = helper.checkifUndefined(venue);
        link_to_virtual_meeting = helper.checkifUndefined(link_to_virtual_meeting);
        dress_code = helper.checkifUndefined(dress_code);
        job_assigned_to = helper.checkifUndefined(job_assigned_to);

        //interview_description = helper.escapeString(interview_description);
        interview_description = helper.checkifUndefined(interview_description);

        interview_date = helper.formatDateToDatetime(interview_date);

        var date_updated = helper.getCurrentTimeStamp();

        var sql = `UPDATE interview SET interview_name = '${interview_name}', interview_date = '${interview_date}', \
                interview_time = '${interview_time}', venue= '${venue}', link_to_virtual_meeting = '${link_to_virtual_meeting}', \
                dress_code = '${dress_code}', description = '${interview_description}', date_updated = '${date_updated}' \
                WHERE interview_id = ${interview_id}`;

        return sql;
    }

    deleteInterviewByInterviewId(interview_id) {
        var sql = `DELETE FROM interview WHERE interview_id = ${interview_id}`;

        return sql;
    }

    updateProfilePictureUrlQuery(user_id, profile_pic_url) {
        var sql = `UPDATE user SET photo_url = '${profile_Apic_url}' WHERE user_id = ${user_id}`;

        return sql;
    }

    static getProfilePercentage(user_id) {
        var sql = `SELECT profile_completeness FROM user WHERE user_id = ${user_id}`;

        return sql;
    }

    getCompanyInfoByCompanyId(company_id) {
        var sql = `SELECT * FROM company WHERE company_id = ${company_id}`;

        return sql;
    }

    getCandidateCV(user_id) {
        var sql = `SELECT r.resume_file_url FROM resume r WHERE user_id = ${user_id}`;

        return sql;
    }

    getTotalNumberOfCandidates() {
        var sql = `SELECT COUNT(*) AS total_no_of_candidates FROM user_role where role_id = 1`;

        return sql;
    }

    getTotalNumberOfCandidatesForTheWeek() {
        var weekStartDate = helper.getDateofDayofTheWeek(0);

        var weekEndDate = helper.getDateofDayofTheWeek(6);

        var sql = `SELECT COUNT(*) AS no_of_candidates_this_week FROM user_role ur \
                INNER JOIN user u ON u.user_id = ur.user_id where role_id = 1 AND \
                u.date_created > '${weekStartDate}' AND u.date_created <= '${weekEndDate}'`;

        return sql;
    }

    getTotalNumberOfRecruiters() {
        var sql = `SELECT COUNT(*) AS total_no_of_recruiters FROM user_role where role_id = 2`;

        return sql;
    }

    getTotalNumberOfRecruitersForTheWeek() {
        var weekStartDate = helper.getDateofDayofTheWeek(0);

        var weekEndDate = helper.getDateofDayofTheWeek(6);

        var sql = `SELECT COUNT(*) AS no_of_recruiters_this_week FROM user_role ur \
                INNER JOIN user u ON u.user_id = ur.user_id where role_id = 2 AND \
                u.date_created > '${weekStartDate}' AND u.date_created <= '${weekEndDate}'`;

        return sql;
    }

    getTotalNumberOfCVsUploaded() {
        var sql = `SELECT COUNT(*) AS total_no_of_cvs_uploaded FROM resume WHERE resume_file_url != ''`;

        return sql;
    }

    getTotalNumberOfCVsUploadedThisWeek() {
        var weekStartDate = helper.getDateofDayofTheWeek(0);

        var weekEndDate = helper.getDateofDayofTheWeek(6);

        var sql = `SELECT COUNT(*) AS no_of_cvs_uploaded_this_week FROM \
                    resume WHERE resume_file_url != '' \
                    AND date_created >= '${weekStartDate}' AND date_created <= '${weekEndDate}'`;

        return sql;
    }

    getCountryAndState(user_id) {
        let sql = `SELECT s.state_name, c.country_name FROM user u \
                    INNER JOIN state s ON u.state = s.state_id \
                    INNER JOIN country c ON u.country = c.country_id \
                    WHERE user_id = ${user_id}`;

        return sql;
    }
}

module.exports = User;