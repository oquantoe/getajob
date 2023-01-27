var path = require('path');

module.exports = {
    "candidate_role_tag": "1",
    "recruiter_admin_role_tag": "2",
    "recruiting_agency_role_tag": "3",
    "admin_role_tag": "4",
    "super_admin_role_tag": "5",
    "recruiter_role_tag": "6",
    "salt": "G3tAj0bNg",
    "true": 1,
    "false": 0,
    "active": "ACTIVE",
    "expired": "EXPIRED",
    "pending": "PENDING",
    "shortlisted": "Shortlisted",
    "declined": "Declined",
    "shortlisted": "Shortlisted",
    "opened": "Opened",
    "closed": "Closed",
    "age_shortlist_param_code": "1",
    "yoe_shortlist_param_code": "2",
    "grade_shortlist_param_code": "3",
    "qualification_shortlist_param_code": "4",
    "gender_shortlist_param_code": "5",
    "language_shortlist_param_code": "6",
    "specialization_shortlist_param_code": "7",
    "gender_status_all": "All",
    "gender_status_male": "Male",
    "gender_status_female": "Female",
    "salt_rounds": 10,
    "activated": 1,
    "not_activated": 0,
    "ap_status_shortlisted": 1,
    "ap_status_interview": 2,
    "ap_status_premise_test": 3,
    "ap_status_recommended": 4,
    "ap_status_not_recommended": 5,
    "ap_status_not_recommended_incomplete_info": 6,
    "success": "Success",
    "failed": "Failed",
    "transaction_reference_prefix": "GAJ",
    "subscription_interval": 30,
    "local_currency": "NGN ",

    //Azure Strings
    "azure_storage_connection_string": process.env.AZURE_STORAGE_CONNECTION_STRING,
    "azure_storage_container_name": "getajobng",
    "docs_sub_container": "docs/",
    "images_sub_container": "images/",
    "profile_pictures_folder": "profile_pictures/",
    "company_logos_folder": "company_logos/",
    "resumes_folder": "resumes/",
    "additional_files_folder": "additional_files/",
    "recruiter_kyc_folder": "recruiter_kyc/",

    "azure_storage_account_name": process.env.StorageAccountName || "cilappstorageaccount",
    "azure_storage_access_key": process.env.StorageAccountKey || "icejvXX2h8y2skvKZ+bF1D9SW5ZJR2cX+e6UO6URXfb05RH8gkwMSjYn+WpNNFkOejqOEhMf3nV0z1gqbUnNFQ==",

    "azure_resume_url": "https://cilappstorageaccount.blob.core.windows.net/getajobng/docs/resumes/",
    "azure_additional_files_url": "https://cilappstorageaccount.blob.core.windows.net/getajobng/docs/additional_files/",
    "azure_profile_pic_url": "https://cilappstorageaccount.blob.core.windows.net/getajobng/images/profile_pictures/",
    "azure_company_logo_url": "https://cilappstorageaccount.blob.core.windows.net/getajobng/images/company_logos/",
    "azure_recruiter_kyc_files_url": "https://cilappstorageaccount.blob.core.windows.net/getajobng/docs/recruiter_kyc/",

    //Paystack keys
    "paystack_test_public_key": "pk_test_7cf038f953f890839bb50585c67c3c15738a0f58",
    "paystack_test_secret_key": "sk_test_db6afd338a2d03398c4e52800f4c99f3bab2c5ca",
    "paystack_live_public_key": "pk_live_854714065a2e6d08a41e06a13510c05d9bb9942a",
    "paystack_live_secret_key": "sk_live_1f42fb566e4eb418b8e961802a2d67621f9d5c24",


    // Session Setting
    "session_secret": "%#*G3tAj0bNg*#%",
    "session_resave": true,
    "session_key": "user_id",
    "session_save_uninitialized": true,
    "session_cookie_max_age": 86400000,

    // Redis Setting
    "redis_host": "localhost",
    "redis_port": 6379,
    "redis_ttl": 260,

    // Assessment grades
    "passed": "Passed",
    "failed": "Failed",

    "port": 7011,
    "localhost_domain": "http://localhost:7011",
    "prod_domain": "https://getajobng.com",

    // DB setting
    "use_database": true,
    "local_db_host": process.env.DB_HOST || "localhost",
    "local_db_username": process.env.DB_USER || "root",
    "local_db_password": process.env.DB_PASS || "",
    "local_database": process.env.DB_NAME || "getajobng_prod_sample",

    "sql_server_host": "sa",
    "sql_server_username": "sa",
    "sql_server_password": "Password@2019",

    "test_server_host": "getajobng.herokuapp.com",
    "test_server_username": "rentacar_gaj_usr",
    "test_server_password": "%Getaj0b1",
    "test_server_database": "rentacar_getajobng",

    // Social Media Signup setting
    "facebook_api_key": "434186087171937",
    "facebook_api_secret": "067562451ee59b23a28c8d2ce3d4e422",
    "facebook_callback_url": "http://localhost:6011/passport/auth/facebook/callback",
    "linkedin_client_id": "776smslkboadtf",
    "linkedin_client_secret": "2v9rNFW80Ziu33bH",
    "linkedin_callback_url": "http://localhost:6011/passport/auth/linkedin/callback",
    "google_client_id": "72079736963-0p24dhqa3bimlrkod7jpasuflc345kh9.apps.googleusercontent.com",
    "google_client_secret": "iMWXLYeWeaA2Fr5UayJcxRbA",
    "google_callback_url": "http://localhost:6011/passport/auth/google/callback",

    // Email setting
    "email_service": "Sendgrid",
    "sendgrid_username": "apikey",
    "sendgrid_password": "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",
    //"from"                    :     '"Jobs from GetaJobNG" <info@getajobng.com>',
    "from": "info@getajobng.com",

    // Paystack setting
    "paystack_secret_key": "sk_test_29fb283ada06fe1aebdb1d3877f1756b20762b6d",
    "paystack_public_key": "pk_test_7fb7a6fdf32b92f648620e46697b79810c7ad291",

    // User keys
    "tag_user_id_session": "user_in_session",
    "tag_user_id": "user_id",
    "tag_user_uuid": "user_uuid",
    "tag_first_name": "first_name",
    "tag_last_name": "last_name",
    "tag_email": "email",
    "tag_phone_number": "phone_number",
    "tag_user_role": "user_role",
    "tag_is_logged_in": "is_logged_in",
    "tag_is_activated": "is_activated",
    "tag_resume_id": "resume_id",
    "tag_is_first_login": "is_first_login",
    "tag_profile_picture_url": "profile_picture_url",
    "tag_gender": "gender",
    "tag_tagline": "tagline",
    "tag_address": "address",
    "tag_profile_completeness": "profile_completeness",

    // Company Keys
    "tag_company_id": "company_id",
    "tag_company_uuid": "company_uuid",
    "tag_company_name": "company_name",

    // Job Keys
    "tag_jobs": "jobs",
    "tag_job_id": "job_id",
    "tag_application_id": "application_id",

    // Resume Keys
    "tag_resume_info": "resume_info",
    "tag_resume_education": "education",
    "tag_resume_work_experience": "work_experience",
    "tag_resume_certification": "certification",
    "tag_resume_referee": "referee",
    "tag_resume_project": "project",
    "tag_resume_association": "association",
    "tag_resume_award": "award",
    "tag_resume_language": "language",
    "tag_resume_specialization": "specialization",
    "tag_resume_skill": "skill",

    // Resume Info Keys
    "tag_resume_id": "resume_id",
    "tag_percentage_complete": "percentage_complete",
    "tag_resume_file_url": "resume_file_url",
    "tag_resume_date_created": "resume_date_created",
    "tag_profile_summary": "profile_summary",
    "tag_willingness_to_travel": "willingness_to_travel",

    // Resume Education Keys
    "tag_education_id": "education_id",
    "tag_name_of_institution": "name_of_institution",
    "tag_qualification": "qualification",
    "tag_qualification_grade": "qualification_grade",
    "tag_edu_start_date": "edu_start_date",
    "tag_edu_end_date": "edu_end_date",
    "tag_edu_description": "edu_description",

    // Resume WE Keys
    "tag_we_experience_id": "experience_id",
    "tag_we_job_title": "job_title",
    "tag_we_employer_name": "employer_name",
    "tag_we_employer_address": "employer_address",
    "tag_we_monthly_salary": "monthly_salary",
    "tag_we_job_type": "job_type",
    "tag_we_start_date": "we_start_date",
    "tag_we_end_date": "we_end_date",
    "tag_we_job_responsibility": "job_responsibility",

    // Resume Specialization Keys
    "tag_specialization_id": "specialization_id",
    "tag_specialization_name": "specialization_name",
    "tag_specialization_description": "specialization_description",

    // Resume Association Keys
    "tag_association_id": "association_id",
    "tag_association_title": "association_title",
    "tag_association_name": "association_name",

    // Resume Award Keys
    "tag_award_id": "award_id",
    "tag_award_certificate_name": "award_certificate_name",
    "tag_award_offered_by": "award_offered_by",
    "tag_date_received": "award_date_received",

    // Resume Certification Keys
    "tag_certification_id": "certification_id",
    "tag_certification_name": "certification_name",
    "tag_certification_description": "certification_description",

    // Resume Language Keys
    "tag_language_id": "language_id",
    "tag_language_name": "language_name",
    "tag_language_level": "language_level",

    // Resume Project Keys
    "tag_project_id": "project_id",
    "tag_project_title": "project_title",
    "tag_project_link": "project_link",
    "tag_project_description": "project_description",

    // Resume Referee Keys
    "tag_referee_id": "referee_id",
    "tag_referee_name": "referee_name",
    "tag_referee_phone_number": "referee_phone_number",
    "tag_referee_email": "referee_email",
    "tag_referee_relationship": "referee_relationship",
    "tag_referee_no_of_years": "referee_no_of_years",
    "tag_referee_address": "referee_address",

    // Job Recommendation Tags
    "tag_job_recommendation_by_qualification": "job_recommendation_by_qualification",
    "tag_job_recommendation_by_gender": "job_recommendation_by_gender",
    "tag_referee_address": "referee_address",

    // CV Search Tags
    "tag_tp_search_results": "tp_search_results",

    "tag_tp_job_title_search_results": "job_title_search_results",
    "tag_tp_keyword_search_results": "keyword_search_results",
    "tag_tp_location_search_results": "location_search_results",
    "tag_tp_education_level_search_results": "education_level_search_results",

    "tag_tp_tagline_search_results": "tagline_search_results",
    "tag_tp_we_rolename_search_results": "we_rolename_search_results",
    "tag_tp_skill_name_search_results": "skill_name_search_results",
    "tag_tp_industry_name_search_results": "industry_name_search_results",
    "tag_tp_company_name_search_results": "company_name_search_results",
    "tag_tp_edu_name_search_results": "edu_name_search_results",
    "tag_tp_state_search_results": "state_search_results",
    "tag_tp_country_search_results": "country_search_results",

    // File Upload Setting
    "resume_upload_dir": path.join(__dirname, "../assets/uploads/docs/resumes/"),
    "additional_resume_upload_dir": path.join(__dirname, "../assets/uploads/docs/other_resumes/"),
    "profile_picture_upload_dir": path.join(__dirname, "../assets/uploads/images/profile_pictures/"),
    "profile_picture_dir": "/uploads/images/profile_pictures/",
    "company_logo_upload_dir": path.join(__dirname, "../assets/uploads/images/company_logos/"),
    "company_logo_dir": "/uploads/images/company_logos/",
    "main_assets_resume_dir": path.join(__dirname, "../../assets/uploads/docs/resumes/"),
    "main_assets_additional_resume_dir": path.join(__dirname, "../../assets/uploads/docs/other_resumes/"),
    "main_assets_profile_pic_dir": path.join(__dirname, "../../assets/uploads/images/profile_pictures/"),

    //Plans
    "basic_plan": 5,
    "classic_plan": 6,
    "premium_plan": 7,

    "cv_review_plan": 1,
    "subscription_plan": 2,
    "cv_self_service_plan": 4,

    //Captcha Keys
    "captcha_site_key": "6Le47JIaAAAAALR0-QhyjK6qZKDooPuAFq1gs0Iw",
    "captcha_secret_key": "6Le47JIaAAAAAAOaaRC_-9V5cKs7uFvPQkXaLvJo",
    "captcha_verification_url_prefix": "https://www.google.com/recaptcha/api/siteverify?secret=",

}