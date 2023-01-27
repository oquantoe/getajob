var config = require('./config');
var logger = require('./log4js');

var sessionStore = {

    saveItem: function(req, key, value) {
        logger.log(req.session[key])
        req.session[key] = value;
    },

    getItem: function(req, key) {
        return req.session[key];
    },

    saveCandidateData: function(req, user_id, user_uuid, first_name, last_name, email, phone_number,
        user_role, is_logged_in, is_activated, resume_id, is_first_login, gender, tagline,
        address, profile_picture) {
        'use strict';


        this.saveItem(req, config.tag_user_id, user_id);
        this.saveItem(req, config.tag_user_uuid, user_uuid);
        this.saveItem(req, config.tag_first_name, first_name);
        this.saveItem(req, config.tag_last_name, last_name);
        this.saveItem(req, config.tag_email, email);
        this.saveItem(req, config.tag_phone_number, phone_number);
        this.saveItem(req, config.tag_user_role, user_role);
        this.saveItem(req, config.tag_is_logged_in, is_logged_in);
        this.saveItem(req, config.tag_is_activated, is_activated);
        this.saveItem(req, config.tag_resume_id, resume_id);
        this.saveItem(req, config.tag_is_first_login, is_first_login);
        this.saveItem(req, config.tag_gender, gender);
        this.saveItem(req, config.tag_tagline, tagline);
        this.saveItem(req, config.tag_address, address);
        this.saveItem(req, config.tag_profile_picture_url, profile_picture);


        logger.log("Candidate Data Saved!");
    },

    getCandidateData: function(req, sessionData) {
        'use strict';

        /*
        var user_id = this.checkifUndefined(this.getItem(req, config.tag_user_id));
        var user_uuid = this.checkifUndefined(this.getItem(req, config.tag_user_uuid));
        var first_name = this.checkifUndefined(this.getItem(req, config.tag_first_name));
        var last_name = this.checkifUndefined(this.getItem(req, config.tag_last_name));
        var email = this.checkifUndefined(this.getItem(req, config.tag_email));
        var phone_number = this.checkifUndefined(this.getItem(req, config.tag_phone_number));
        var user_role = this.checkifUndefined(this.getItem(req, config.tag_user_role));
        var is_logged_in = this.checkifUndefined(this.getItem(req, config.tag_is_logged_in));
        var is_activated = this.checkifUndefined(this.getItem(req, config.tag_is_activated));
        var resume_id = this.checkifUndefined(this.getItem(req, config.tag_resume_id));
        var is_first_login = this.checkifUndefined(this.getItem(req, config.tag_is_first_login));
        var gender = this.checkifUndefined(this.getItem(req, config.tag_gender));
        var tagline = this.checkifUndefined(this.getItem(req, config.tag_tagline));
        var address = this.checkifUndefined(this.getItem(req, config.tag_address));
        var profile_picture = this.checkifUndefined(this.getItem(req, config.tag_profile_picture_url));
*/

        logger.log("in getting data");
        //logger.log(req.session)



        var user_id = this.checkifUndefined(sessionData.user_id);
        var user_uuid = this.checkifUndefined(sessionData.user_uuid);
        var first_name = this.checkifUndefined(sessionData.first_name);
        var last_name = this.checkifUndefined(sessionData.last_name);
        var email = this.checkifUndefined(sessionData.email);
        var phone_number = this.checkifUndefined(sessionData.phone_number);
        var user_role = this.checkifUndefined(sessionData.user_role);
        var is_logged_in = this.checkifUndefined(sessionData.is_logged_in);
        var is_activated = this.checkifUndefined(sessionData.is_activated);
        var resume_id = this.checkifUndefined(sessionData.resume_id);
        var is_first_login = this.checkifUndefined(sessionData.is_first_login);
        var gender = this.checkifUndefined(sessionData.gender);
        var tagline = this.checkifUndefined(sessionData.tagline);
        var address = this.checkifUndefined(sessionData.address);
        var profile_picture = this.checkifUndefined(sessionData.profile_picture);

        var full_name = first_name + ' ' + last_name;

        var data = {
            user_id: user_id,
            user_uuid: user_uuid,
            first_name: first_name,
            last_name: last_name,
            full_name: full_name,
            email: email,
            phone_number: phone_number,
            user_role: user_role,
            is_logged_in: is_logged_in,
            is_activated: is_activated,
            resume_id: resume_id,
            is_first_login: is_first_login,
            gender: gender,
            tagline: tagline,
            address: address,
            profile_picture: profile_picture
        };

        return data;
    },

    saveRecruiterData: function(req, user_id, user_uuid, first_name, last_name, email, phone_number, user_role,
        is_logged_in, company_id, company_name, is_activated, is_first_login, profile_picture) {
        'use strict';

        this.saveItem(req, config.tag_user_id, user_id);
        this.saveItem(req, config.tag_user_uuid, user_uuid);
        this.saveItem(req, config.tag_first_name, first_name);
        this.saveItem(req, config.tag_last_name, last_name);
        this.saveItem(req, config.tag_email, email);
        this.saveItem(req, config.tag_phone_number, phone_number);
        this.saveItem(req, config.tag_user_role, user_role);
        this.saveItem(req, config.tag_is_logged_in, is_logged_in);
        this.saveItem(req, config.tag_company_id, company_id);
        this.saveItem(req, config.tag_company_name, company_name);
        this.saveItem(req, config.tag_is_activated, is_activated);
        this.saveItem(req, config.tag_is_first_login, is_first_login);
        this.saveItem(req, config.tag_profile_picture_url, profile_picture);

        logger.log("Recruiter Data Saved!");
    },

    getRecruiterData: function(req) {
        'use strict';

        var user_id = this.checkifUndefined(this.getItem(req, config.tag_user_id));
        var user_uuid = this.checkifUndefined(this.getItem(req, config.tag_user_uuid));
        var first_name = this.checkifUndefined(this.getItem(req, config.tag_first_name));
        var last_name = this.checkifUndefined(this.getItem(req, config.tag_last_name));
        var email = this.checkifUndefined(this.getItem(req, config.tag_email));
        var phone_number = this.checkifUndefined(this.getItem(req, config.tag_phone_number));
        var user_role = this.checkifUndefined(this.getItem(req, config.tag_user_role));
        var is_logged_in = this.checkifUndefined(this.getItem(req, config.tag_is_logged_in));
        var is_activated = this.checkifUndefined(this.getItem(req, config.tag_is_activated));
        var company_id = this.checkifUndefined(this.getItem(req, config.tag_company_id));
        var company_name = this.checkifUndefined(this.getItem(req, config.tag_company_name));
        var is_first_login = this.checkifUndefined(this.getItem(req, config.tag_is_first_login));
        var profile_picture = this.checkifUndefined(this.getItem(req, config.tag_profile_picture_url));

        var full_name = first_name + ' ' + last_name;

        var data = {
            user_id: user_id,
            user_uuid: user_uuid,
            first_name: first_name,
            last_name: last_name,
            full_name: full_name,
            email: email,
            phone_number: phone_number,
            user_role: user_role,
            is_logged_in: is_logged_in,
            is_activated: is_activated,
            company_id: company_id,
            company_name: company_name,
            is_first_login: is_first_login,
            profile_picture: profile_picture
        };

        return data;
    },

    saveCandidateResumeInfo: function(req, resume) {
        'use strict';

        /*
        req.session.resume_data = {
            resume_id : resume.resume_id,
            percentage_complete : resume.percentage_complete,
            resume_file_url : resume.resume_file_url,
            date_created : resume.date_created,
            profile_summary : resume.profile_summary,
            willingness_to_travel : resume.willingness_to_travel,
        }
        */

        req.session.resume_data = { resume_info: JSON.stringify(resume) };

        logger.log("Resume Info Saved!");
    },

    getCandidateResumeInfo: function(req) {
        'use strict';
        logger.log('req.session')
        logger.log(req.session)

        var resumeInfoInSession = JSON.parse(req.session.resume_data);

        logger.log(resumeInfoInSession)

        var resume_id = this.checkifUndefined(resumeInfoInSession.resume_id);
        var percentage_complete = this.checkifUndefined(resumeInfoInSession.percentage_complete);
        var resume_file_url = this.checkifUndefined(resumeInfoInSession.resume_file_url);
        var date_created = this.checkifUndefined(resumeInfoInSession.date_created);
        var profile_summary = this.checkifUndefined(resumeInfoInSession.profile_summary);
        var willingness_to_travel = this.checkifUndefined(resumeInfoInSession.willingness_to_travel);


        var resumeInfo = {
            resume_id: resume_id,
            percentage_complete: percentage_complete,
            resume_file_url: resume_file_url,
            date_created: date_created,
            profile_summary: profile_summary,
            willingness_to_travel: willingness_to_travel,
        };

        return resumeInfo;
    },

    saveCandidateResumeEducation: function(req, education) {
        this.saveArrayinSession(req, config.tag_resume_education, education);
        req.session.resume_data.education = JSON.stringify(education);

        logger.log("Resume Education Saved!");
    },

    getCandidateResumeEducation: function(req) {
        logger.log("req.session.resume_data");
        logger.log(req.session.resume_data);

        var educationData = JSON.parse(req.session.resume_data.education);

        logger.log("educationData");
        logger.log(educationData);

        return educationData;
    },

    saveCandidateResumeWE: function(req, work_experience) {
        this.saveArrayinSession(req, config.tag_resume_work_experience, work_experience);

        logger.log("Resume W.E Saved!");
    },

    getCandidateResumeWE: function(req) {
        return this.getArrayFromSession(req, config.tag_resume_work_experience);
    },

    saveCandidateResumeSpecialization: function(req, specialization) {
        this.saveArrayinSession(req, config.tag_resume_specialization, specialization);

        logger.log("Resume specialization Saved!");
    },

    getCandidateResumeSpecialization: function(req) {
        return this.getArrayFromSession(req, config.tag_resume_specialization);
    },

    saveCandidateResumeAssociation: function(req, association) {
        this.saveArrayinSession(req, config.tag_resume_association, association);

        logger.log("Resume association Saved!");
    },

    getCandidateResumeAssociation: function(req) {
        return this.getArrayFromSession(req, config.tag_resume_association);
    },

    saveCandidateResumeAward: function(req, award) {
        this.saveArrayinSession(req, config.tag_resume_award, award);

        logger.log("Resume Award Saved!");
    },

    getCandidateResumeAward: function(req) {
        return this.getArrayFromSession(req, config.tag_resume_award);
    },

    saveCandidateResumeCertification: function(req, certification) {
        this.saveArrayinSession(req, config.tag_resume_certification, certification);

        logger.log("Resume Certification Saved!");
    },

    getCandidateResumeCertification: function(req) {
        return this.getArrayFromSession(req, config.tag_resume_certification);
    },

    saveCandidateResumeLanguage: function(req, language) {
        this.saveArrayinSession(req, config.tag_resume_language, language);

        logger.log("Resume Language Saved!");
    },

    getCandidateResumeLanguage: function(req) {
        return this.getArrayFromSession(req, config.tag_resume_language);
    },

    saveCandidateResumeReferee: function(req, referee) {
        this.saveArrayinSession(req, config.tag_resume_referee, referee);

        logger.log("Resume Referee Saved!");
    },

    getCandidateResumeReferee: function(req) {
        return this.getArrayFromSession(req, config.tag_resume_referee);
    },

    saveCandidateResumeProject: function(req, project) {
        this.saveArrayinSession(req, config.tag_resume_project, project);

        logger.log("Resume Project Saved!");
    },

    getCandidateResumeProject: function(req) {
        return this.getArrayFromSession(req, config.tag_resume_project);
    },

    saveCandidateResumeSkill: function(req, skill) {
        this.saveArrayinSession(req, config.tag_resume_skill, skill);

        logger.log("Resume Skill Saved!");
    },

    getCandidateResumeSkill: function(req) {
        return this.getArrayFromSession(req, config.tag_resume_skill);
    },

    saveUsersRecommendedJobs: function(req, jobs) {
        this.saveArrayinSession(req, config.tag_jobs, jobs);

        logger.log("Recommended Jobs Saved!");
    },

    getUsersRecommendedJobs: function(req) {
        return this.getArrayFromSession(req, config.tag_jobs);
    },

    saveUsersRecommendedJobsByQualification: function(req, jobs) {
        this.saveArrayinSession(req, config.tag_job_recommendation_by_qualification, jobs);

        logger.log("Recommended Jobs By Qualification Saved!");
    },

    getUsersRecommendedJobsByQualification: function(req) {
        return this.getArrayFromSession(req, config.tag_job_recommendation_by_qualification);
    },

    saveUsersRecommendedJobsByGender: function(req, jobs) {
        this.saveArrayinSession(req, config.tag_job_recommendation_by_gender, jobs);

        logger.log("Recommended Jobs By Gender Saved!");
    },

    getUsersRecommendedJobsByGender: function(req) {
        return this.getArrayFromSession(req, config.tag_job_recommendation_by_gender);
    },

    getAllUsersRecommendedJobs: function(req) {
        var recommendedJobsByQualification = this.getUsersRecommendedJobsByQualification(req);
        var recommendedJobByGender = this.getUsersRecommendedJobsByGender(req);

        var allUsersRecommendedJobs = recommendedJobsByQualification.concat(recommendedJobByGender);

        return this.sortRecommendedJobsArray(allUsersRecommendedJobs);
    },

    sortRecommendedJobsArray: function(unsortedArray) {
        var sortedArray = unsortedArray.concat();

        for (var i = 0; i < sortedArray.length; ++i) {
            for (var j = i + 1; j < sortedArray.length; ++j) {
                if (sortedArray[i].job_id === sortedArray[j].job_id) {
                    sortedArray.splice(j--, 1);
                }
            }
        }

        return sortedArray;
    },

    saveUserId: function(req, user_id) {
        //this.saveItem(req, config.tag_user_id_session, user_id);
        req.session.user_id = user_id;
    },

    getUserId: function(req) {
        return req.session.passport.user.user_id;
        //return this.getItem(req, config.tag_user_id_session);
    },

    saveProfilePicture: function(req, profile_picture_url) {
        this.saveItem(req, config.tag_profile_picture_url, profile_picture_url);
    },

    getProfilePicture: function(req) {
        return this.getItem(req, config.tag_profile_picture_url);
    },

    saveArrayinSession: function(req, key, array) {
        'use strict';

        var stringedArr = JSON.stringify(array);
        this.saveItem(req, key, stringedArr);
    },

    getArrayFromSession: function(req, key) {
        'use strict';

        var stringedArr = this.getItem(req, key);
        return JSON.parse(stringedArr);
    },

    checkifUndefined: function(value) {
        if (typeof value === 'undefined') {
            return '';

        } else {
            return value;
        }
    },



    saveTPTaglineSearchResults: function(req, users) {
        this.saveArrayinSession(req, config.tag_tp_tagline_search_results, users);

        logger.log("Tagline search results Saved!");
    },

    getTPTaglineSearchResults: function(req) {
        return this.getArrayFromSession(req, config.tag_tp_tagline_search_results);
    },

    saveTPWERolenameSearchResults: function(req, users) {
        this.saveArrayinSession(req, config.tag_tp_we_rolename_search_results, users);

        logger.log("W.E Rolename search results Saved!");
    },

    getTPWERolenameSearchResults: function(req) {
        return this.getArrayFromSession(req, config.tag_tp_we_rolename_search_results);
    },



    saveTPSkillSearchResults: function(req, users) {
        this.saveArrayinSession(req, config.tag_tp_skill_name_search_results, users);

        logger.log("Skill search results Saved!");
    },

    getTPSkillSearchResults: function(req) {
        return this.getArrayFromSession(req, config.tag_tp_skill_name_search_results);
    },

    saveTPIndustrySearchResults: function(req, users) {
        this.saveArrayinSession(req, config.tag_tp_industry_name_search_results, users);

        logger.log("Industry search results Saved!");
    },

    getTPIndustrySearchResults: function(req) {
        return this.getArrayFromSession(req, config.tag_tp_industry_name_search_results);
    },

    saveTPCompanySearchResults: function(req, users) {
        this.saveArrayinSession(req, config.tag_tp_company_name_search_results, users);

        logger.log("Company search results Saved!");
    },

    getTPCompanySearchResults: function(req) {
        return this.getArrayFromSession(req, config.tag_tp_company_name_search_results);
    },

    saveTPEduNameSearchResults: function(req, users) {
        this.saveArrayinSession(req, config.tag_tp_edu_name_search_results, users);

        logger.log("School Name search results Saved!");
    },

    getTPEduNameSearchResults: function(req) {
        return this.getArrayFromSession(req, config.tag_tp_edu_name_search_results);
    },



    saveTPStateSearchResults: function(req, users) {
        this.saveArrayinSession(req, config.tag_tp_state_search_results, users);

        logger.log("State search results Saved!");
    },

    getTPStateSearchResults: function(req) {
        return this.getArrayFromSession(req, config.tag_tp_state_search_results);
    },

    saveTPCountrySearchResults: function(req, users) {
        this.saveArrayinSession(req, config.tag_tp_country_search_results, users);

        logger.log("Country search results Saved!");
    },

    getTPCountrySearchResults: function(req) {
        return this.getArrayFromSession(req, config.tag_tp_country_search_results);
    },

    saveTPEducationLevelSearchResults: function(req, users) {
        this.saveArrayinSession(req, config.tag_tp_education_level_search_results, users);
        logger.log("Education Level search results Saved!");

        this.collateAllTalentsSearchResults(users);
    },

    getTPEducationLevelSearchResults: function(req) {
        return this.getArrayFromSession(req, config.tag_tp_education_level_search_results);
    },


    //Collate job title results
    collateJobTitleSearchResults: function(req) {
        var tagline_search_results = this.getTPTaglineSearchResults(req);
        var we_rolename_search_results = this.getTPWERolenameSearchResults(req);

        var allJobTitleResults = tagline_search_results.concat(we_rolename_search_results);

        //Save all Job Title Results
        this.saveAllJobTitleSearchResults(this.sortUsersArray(allJobTitleResults));
        this.collateAllTalentsSearchResults(allJobTitleResults);
    },

    saveAllJobTitleSearchResults: function(req, users) {
        this.saveArrayinSession(req, config.tag_tp_job_title_search_results, users);

        logger.log("Job Title search results Saved!");
    },

    getAllJobTitleSearchResults: function(req) {
        return this.getArrayFromSession(req, config.tag_tp_job_title_search_results);
    },


    //Collate location results
    collateLocationSearchResults: function(req) {
        var state_search_results = this.getTPStateSearchResults(req);
        var country_search_results = this.getTPCountrySearchResults(req);

        var allLocationResults = state_search_results.concat(country_search_results);

        //Save all Location Results
        this.saveAllLocationSearchResults(this.sortUsersArray(allLocationResults));
        this.collateAllTalentsSearchResults(allLocationResults);
    },

    saveAllLocationSearchResults: function(req, users) {
        this.saveArrayinSession(req, config.tag_tp_location_search_results, users);

        logger.log("Location search results Saved!");
    },

    getAllLocationSearchResults: function(req) {
        return this.getArrayFromSession(req, config.tag_tp_location_search_results);
    },

    //Collate keyword results
    collateKeywordSearchResults: function(req) {
        var skill_search_results = this.getTPSkillSearchResults(req);
        //var industry_search_results = this.getTPIndustrySearchResults(req);
        var company_name_search_results = this.getTPCompanySearchResults(req);
        var education_name_search_results = this.getTPEduNameSearchResults(req);

        var allKeywordResults = skill_search_results.concat(company_name_search_results, education_name_search_results);

        //Save all Keyword Results
        this.saveAllKeywordSearchResults(this.sortUsersArray(allKeywordResults));
        this.collateAllTalentsSearchResults(allKeywordResults);
    },

    saveAllKeywordSearchResults: function(req, users) {
        this.saveArrayinSession(req, config.tag_tp_keyword_search_results, users);

        logger.log("Keyword search results Saved!");
    },

    getAllKeywordSearchResults: function(req) {
        return this.getArrayFromSession(req, config.tag_tp_keyword_search_results);
    },


    collateAllTalentsSearchResults: function(req, array) {
        var allTalentResults = this.getAllTalentSearchResults(req);
        //logger.log('allTalentResults')
        //logger.log(allTalentResults)
        // logger.log('array')
        //logger.log(array)

        if (!allTalentResults) {
            //   logger.log('allTalentResults is null..Processing ...')
            this.saveAllTalentSearchResults(req, array);
        } else {
            if (array) {
                //    logger.log('array exist..Processing ...')

                allTalentResults = allTalentResults.concat(array);

                this.saveAllTalentSearchResults(req, this.sortUsersArray(allTalentResults));
                //   logger.log('Array added to allTalentResults')
            }
        }



    },

    saveAllTalentSearchResults: function(req, users) {
        this.saveArrayinSession(req, config.tag_tp_search_results, users);

        logger.log("Talent results Saved!");
    },

    getAllTalentSearchResults: function(req) {
        return this.getArrayFromSession(req, config.tag_tp_search_results);
    },



    sortUsersArray: function(unsortedArray) {
        var sortedArray = unsortedArray.concat();

        for (var i = 0; i < sortedArray.length; ++i) {
            for (var j = i + 1; j < sortedArray.length; ++j) {
                if (sortedArray[i].user_id === sortedArray[j].user_id) {
                    sortedArray.splice(j--, 1);
                }
            }
        }

        return sortedArray;
    },

    saveProfilePercentage: function(req, profile_completeness) {
        this.saveItem(req, config.tag_profile_completeness, profile_completeness);
    },

    getProfilePercentage: function(req) {
        return this.getItem(req, config.tag_profile_completeness);
    },

}

module.exports = sessionStore;