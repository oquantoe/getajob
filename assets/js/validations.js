function validateCandidateRegForm() {
    // Retrieving the values of form elements 
    var first_name = document.candidateRegForm.candidate_first_name.value;
    var last_name = document.candidateRegForm.candidate_last_name.value;
    var email = document.candidateRegForm.candidate_email.value;
    var phone_number = document.candidateRegForm.candidate_phone_number.value;
    var password = document.candidateRegForm.candidate_password.value;
    var retype_password = document.candidateRegForm.candidate_retype_password.value;

    var gender = document.candidateRegForm.candidate_gender.value;
    var dob = document.candidateRegForm.candidate_dob.value;
    var state = document.candidateRegForm.candidate_state.value;
    var country = document.candidateRegForm.candidate_country.value;
    var qualification = document.candidateRegForm.candidate_qualification.value;
    var industry = document.candidateRegForm.candidate_industry.value;
    var yoe = document.candidateRegForm.candidate_yoe.value;

    // Defining error variables with a default value
    var firstNameErr = true;
    var lastNameErr = true;
    var emailErr = true;
    var phoneErr = true;
    var passwordErr = true;
    var genderErr = true;
    var dobErr = true;
    var stateErr = true;
    var countryErr = true;
    var qualificationErr = true;
    var industryErr = true;
    var yoeErr = true;

    // Validate first name
    if (first_name == "") {
        printError("firstNameErr", "Please enter your First Name");
    } else {
        var regex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
        if (regex.test(first_name) === false) {
            printError("firstNameErr", "Please enter a valid name");
        } else {
            printError("firstNameErr", "");
            firstNameErr = false;
        }
    }

    // Validate last name
    if (last_name == "") {
        printError("lastNameErr", "Please enter your Last Name");
    } else {
        var regex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
        if (regex.test(last_name) === false) {
            printError("lastNameErr", "Please enter a valid name");
        } else {
            printError("lastNameErr", "");
            lastNameErr = false;
        }
    }

    // Validate email address
    if (email == "") {
        printError("emailErr", "Please enter your Email address");
    } else {
        // Regular expression for basic email validation
        var regex = /^\S+@\S+\.\S+$/;
        if (regex.test(email) === false) {
            printError("emailErr", "Please enter a valid Email address");
        } else {
            printError("emailErr", "");
            emailErr = false;
        }
    }

    // Validate phone number
    if (phone_number == "") {
        printError("phoneErr", "Please enter your Phone Number");
    } else {
        var regex = /^[0-9]\d{10}$/;
        if (regex.test(phone_number) === false) {
            printError("phoneErr", "Please enter a valid 11 digit phone number");
        } else {
            printError("phoneErr", "");
            phoneErr = false;
        }
    }

    // Validate gender
    if (gender == "") {
        printError("genderErr", "Please select your Gender");
    } else {
        printError("genderErr", "");
        genderErr = false;
    }

    // Validate dob
    if (dob == "") {
        printError("dobErr", "Please enter your Date of birth");
    } else {
        printError("dobErr", "");
        dobErr = false;
    }

    // Validate state
    if (state == "0") {
        printError("stateErr", "Please select your State");
    } else {
        printError("stateErr", "");
        stateErr = false;
    }

    // Validate country
    if (country == "0") {
        printError("countryErr", "Please select your Country");
    } else {
        printError("countryErr", "");
        countryErr = false;
    }

    // Validate qualification
    if (qualification == "0") {
        printError("qualificationErr", "Please select your Highest Qualification");
    } else {
        printError("qualificationErr", "");
        qualificationErr = false;
    }

    // Validate industry
    if (industry == "0") {
        printError("industryErr", "Please select your Industry");
    } else {
        printError("industryErr", "");
        industryErr = false;
    }

    // Validate yoe
    if (yoe == "") {
        printError("yoeErr", "Please select your Years of Experience");
    } else {
        printError("yoeErr", "");
        yoeErr = false;
    }


    // Validate password
    if (password == "") {
        printError("passwordErr", "Please enter a password");
    } else {
        var regex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
        if (regex.test(password) === false) {
            printError("passwordErr", "Please enter a valid password. Password length must be at least 6 characters. Must contain at least 1 lowercase, 1 uppercase and 1 number");

        } else if (password != retype_password) {
            printError("passwordErr", "Password Mismatch");

        } else {
            printError("passwordErr", "");
            passwordErr = false;
        }
    }

    // Prevent the form from being submitted if there are any errors
    if ((firstNameErr || lastNameErr || emailErr || phoneErr || passwordErr || genderErr || dobErr || stateErr || countryErr || qualificationErr || industryErr || yoeErr) == true) {
        return false;
    } else {
        return true;
    }
}

function validateRecruiterRegForm() {
    // Retrieving the values of form elements 
    var recruiter_class = document.recruiterRegForm.recruiter_class.value;

    var first_name = document.recruiterRegForm.recruiter_first_name.value;
    var last_name = document.recruiterRegForm.recruiter_last_name.value;
    var email = document.recruiterRegForm.recruiter_email.value;
    var phone_number = document.recruiterRegForm.recruiter_phone_number.value;
    var company_name = document.recruiterRegForm.recruiter_company_name.value;
    var industry = document.recruiterRegForm.industry.value;
    var password = document.recruiterRegForm.recruiter_password.value;
    var retype_password = document.recruiterRegForm.recruiter_retype_password.value;
    var rc_number = document.recruiterRegForm.recruiter_rc_number.value;
    var cert_of_incorp = document.recruiterRegForm.cert_of_incorporation.value;

    if (recruiter_class == 'individual') {
        // Defining error variables with a default value
        var recFirstNameErr = recLastNameErr = recEmailErr = recPhoneErr = recPasswordErr = true;

        // Validate first name
        if (first_name == "") {
            printError("recFirstNameErr", "Please enter your First Name");
        } else {
            var regex = /^[a-zA-Z\s]+$/;
            if (regex.test(first_name) === false) {
                printError("recFirstNameErr", "Please enter a valid name");
            } else {
                printError("recFirstNameErr", "");
                recFirstNameErr = false;
            }
        }

        // Validate last name
        if (last_name == "") {
            printError("recLastNameErr", "Please enter your Last Name");
        } else {
            var regex = /^[a-zA-Z\s]+$/;
            if (regex.test(last_name) === false) {
                printError("recLastNameErr", "Please enter a valid name");
            } else {
                printError("recLastNameErr", "");
                recLastNameErr = false;
            }
        }

        // Validate email address
        if (email == "") {
            printError("recEmailErr", "Please enter your email address");
        } else {
            // Regular expression for basic email validation
            var regex = /^\S+@\S+\.\S+$/;
            if (regex.test(email) === false) {
                printError("recEmailErr", "Please enter a valid email address");
            } else {
                printError("recEmailErr", "");
                recEmailErr = false;
            }
        }

        // Validate phone number
        if (phone_number == "") {
            printError("recPhoneErr", "Please enter your Phone Number");
        } else {
            var regex = /^[0-9]\d{10}$/;
            if (regex.test(phone_number) === false) {
                printError("recPhoneErr", "Please enter a valid 11 digit phone number");
            } else {
                printError("recPhoneErr", "");
                recPhoneErr = false;
            }
        }

        // Validate password
        if (password == "") {
            printError("recPasswordErr", "Please enter a password");
        } else {
            var regex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
            if (regex.test(password) === false) {
                printError("recPasswordErr", "Please enter a valid password. Password length must be at least 6 characters. Must contain at least 1 lowercase, 1 uppercase and 1 number");

            } else if (password != retype_password) {
                printError("recPasswordErr", "Password Mismatch");

            } else {
                printError("recPasswordErr", "");
                recPasswordErr = false;
            }
        }

        // Prevent the form from being submitted if there are any errors
        if ((recFirstNameErr || recLastNameErr || recEmailErr || recPhoneErr || recPasswordErr) == true) {
            return false;
        } else {
            return true;
        }

    } else if (recruiter_class == 'corporate') {
        // Defining error variables with a default value
        var recFirstNameErr = recLastNameErr = recEmailErr = recPhoneErr = recPasswordErr =
            recCompanyNameErr = recIndustryErr = recCertOfIncorpErr = true;

        // Validate company name
        if (company_name == "") {
            printError("recCompanyNameErr", "Please enter your Company Name");
        } else {
            var regex = /^[a-zA-Z\s]+$/;
            if (regex.test(company_name) === false) {
                printError("recCompanyNameErr", "Please enter a valid Company Name");
            } else {
                printError("recCompanyNameErr", "");
                recCompanyNameErr = false;
            }
        }

        // Validate certificate of incorporation
        if (cert_of_incorp == "") {
            printError("recCertOfIncorpErr", "Please upload your Certificate of Incorporation");
        } else {
            printError("recCertOfIncorpErr", "");
            recCertOfIncorpErr = false;
        }

        // Validate first name
        if (first_name == "") {
            printError("recFirstNameErr", "Please enter your First Name");
        } else {
            var regex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
            if (regex.test(first_name) === false) {
                printError("recFirstNameErr", "Please enter a valid name");
            } else {
                printError("recFirstNameErr", "");
                recFirstNameErr = false;
            }
        }

        // Validate last name
        if (last_name == "") {
            printError("recLastNameErr", "Please enter your Last Name");
        } else {
            //var regex = /^[a-zA-Z\s]+$/;
            var regex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
            if (regex.test(last_name) === false) {
                printError("recLastNameErr", "Please enter a valid name");
            } else {
                printError("recLastNameErr", "");
                recLastNameErr = false;
            }
        }

        // Validate email address
        if (email == "") {
            printError("recEmailErr", "Please enter your email address");
        } else {
            // Regular expression for basic email validation
            var regex = /^\S+@\S+\.\S+$/;
            if (regex.test(email) === false) {
                printError("recEmailErr", "Please enter a valid email address");
            } else {
                printError("recEmailErr", "");
                recEmailErr = false;
            }
        }

        // Validate phone number
        if (phone_number == "") {
            printError("recPhoneErr", "Please enter your Phone Number");
        } else {
            var regex = /^[0-9]\d{10}$/;
            if (regex.test(phone_number) === false) {
                printError("recPhoneErr", "Please enter a valid 11 digit phone number");
            } else {
                printError("recPhoneErr", "");
                recPhoneErr = false;
            }
        }

        // Validate password
        if (password == "") {
            printError("recPasswordErr", "Please enter a password");
        } else {
            var regex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
            if (regex.test(password) === false) {
                printError("recPasswordErr", "Please enter a valid password. Password length must be at least 6 characters. Must contain at least 1 lowercase, 1 uppercase and 1 number");

            } else if (password != retype_password) {
                printError("recPasswordErr", "Password Mismatch");

            } else {
                printError("recPasswordErr", "");
                recPasswordErr = false;
            }
        }

        // Validate industry
        if (industry == "0") {
            printError("recIndustryErr", "Please select your company's industry");
        } else {
            printError("recIndustryErr", "");
            recIndustryErr = false;
        }


        // Prevent the form from being submitted if there are any errors
        if ((recFirstNameErr || recLastNameErr || recEmailErr || recPhoneErr || recCompanyNameErr ||
                recIndustryErr || recPasswordErr || recCertOfIncorpErr) == true) {
            return false;
        } else {
            return true;
        }
    }
}

function validateChangePasswordForm() {
    var ifConfirmed = confirm("Are you sure you want to change your password?");

    if (ifConfirmed) {
        // Retrieving the values of form elements 
        var current_password = document.changePasswordForm.current_password.value;
        var new_password = document.changePasswordForm.new_password.value;
        var confirm_password = document.changePasswordForm.confirm_password.value;

        // Defining error variables with a default value
        var currentPasswordErr = newPasswordErr = confirmPasswordErr = true;


        // Validate current password
        if (current_password == "") {
            printError("currentPasswordErr", "Please enter a password");
        } else {
            var regex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
            if (regex.test(current_password) === false) {
                printError("currentPasswordErr", "Please enter a valid password. Password length must be at least 6 characters. Must contain at least 1 lowercase, 1 uppercase and 1 number");

            } else {
                printError("currentPasswordErr", "");
                currentPasswordErr = false;
            }
        }


        // Validate new and confirm password
        if (new_password == "") {
            printError("newPasswordErr", "Please enter a password");
        } else {
            var regex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
            if (regex.test(new_password) === false) {
                printError("newPasswordErr", "Please enter a valid password. Password length must be at least 6 characters. Must contain at least 1 lowercase, 1 uppercase and 1 number");

            } else if (new_password != confirm_password) {
                printError("confirmPasswordErr", "New and Confirm Password Mismatch");

            } else {
                printError("confirmPasswordErr", "");
                printError("newPasswordErr", "");
                confirmPasswordErr = false;
                newPasswordErr = false;
            }
        }


        // Prevent the form from being submitted if there are any errors
        if ((currentPasswordErr || newPasswordErr || confirmPasswordErr) == true) {
            return false;
        } else {
            return true;
        }
    }
}

function validateCreatePasswordForm() {
    var ifConfirmed = confirm("Are you these information correct?");

    if (ifConfirmed) {
        // Retrieving the values of form elements 
        var first_name = document.createPasswordForm.first_name.value;
        var last_name = document.createPasswordForm.last_name.value;
        var new_password = document.createPasswordForm.password.value;
        var confirm_password = document.createPasswordForm.confirm_password.value;

        // Defining error variables with a default value
        var firstNameErr = lastNameErr = newPasswordErr = confirmPasswordErr = true;

        // Validate first name
        if (first_name == "") {
            printError("firstNameErr", "Please enter your First Name");
        } else {
            var regex = /^[a-zA-Z\s]+$/;
            if (regex.test(first_name) === false) {
                printError("firstNameErr", "Please enter a valid name");
            } else {
                printError("firstNameErr", "");
                firstNameErr = false;
            }
        }

        // Validate last name
        if (last_name == "") {
            printError("lastNameErr", "Please enter your Last Name");
        } else {
            var regex = /^[a-zA-Z\s]+$/;
            if (regex.test(last_name) === false) {
                printError("lastNameErr", "Please enter a valid name");
            } else {
                printError("lastNameErr", "");
                lastNameErr = false;
            }
        }

        // Validate new and confirm password
        if (new_password == "") {
            printError("newPasswordErr", "Please enter a password");
        } else {
            var regex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
            if (regex.test(new_password) === false) {
                printError("newPasswordErr", "Please enter a valid password. Password length must be at least 6 characters. Must contain at least 1 lowercase, 1 uppercase and 1 number");

            } else if (new_password != confirm_password) {
                printError("confirmPasswordErr", "New and Confirm Password Mismatch");

            } else {
                printError("confirmPasswordErr", "");
                printError("newPasswordErr", "");
                confirmPasswordErr = false;
                newPasswordErr = false;
            }
        }


        // Prevent the form from being submitted if there are any errors
        if ((firstNameErr || lastNameErr || newPasswordErr || confirmPasswordErr) == true) {
            return false;
        } else {
            return true;
        }
    }
}

function validateUpdateProfileForm() {
    var ifConfirmed = confirm("Are all of your details correct?");

    if (ifConfirmed) {
        // Retrieving the values of form elements 
        var last_name = document.updateProfileForm.last_name.value;
        var first_name = document.updateProfileForm.first_name.value;
        var email = document.updateProfileForm.email.value;
        var phone_number = document.updateProfileForm.phone_number.value;
        var address = document.updateProfileForm.address.value;
        var gender = document.updateProfileForm.gender.value;
        var dob = document.updateProfileForm.dob.value;
        var tagline = document.updateProfileForm.tagline.value;
        var industry = document.updateProfileForm.industry.value;

        // Defining error variables with a default value
        var lastNameErr = true;
        var firstNameErr = true;
        var emailErr = true;
        var phoneErr = true;
        var addressErr = true;
        var genderErr = true;
        var dobErr = true;
        var taglineErr = true;
        var industryErr = true;


        // Validate first name
        if (first_name == "") {
            printError("firstNameErr", "Please enter your First Name");
        } else {
            var regex = /^[a-zA-Z\s]+$/;
            if (regex.test(first_name) === false) {
                printError("firstNameErr", "Please enter a valid name");
            } else {
                printError("firstNameErr", "");
                firstNameErr = false;
            }
        }

        // Validate last name
        if (last_name == "") {
            printError("lastNameErr", "Please enter your Last Name");
        } else {
            var regex = /^[a-zA-Z\s]+$/;
            if (regex.test(last_name) === false) {
                printError("lastNameErr", "Please enter a valid name");
            } else {
                printError("lastNameErr", "");
                lastNameErr = false;
            }
        }

        // Validate email address
        if (email == "") {
            printError("emailErr", "Please enter your email address");
        } else {
            // Regular expression for basic email validation
            var regex = /^\S+@\S+\.\S+$/;
            if (regex.test(email) === false) {
                printError("emailErr", "Please enter a valid email address");
            } else {
                printError("emailErr", "");
                emailErr = false;
            }
        }

        // Validate phone number
        if (phone_number == "") {
            printError("phoneErr", "Please enter your Phone Number");
        } else {
            var regex = /^[0-9]\d{10}$/;
            if (regex.test(phone_number) === false) {
                printError("phoneErr", "Please enter a valid 11 digit phone number");
            } else {
                printError("phoneErr", "");
                phoneErr = false;
            }
        }

        // Validate gender
        if (gender == "") {
            printError("genderErr", "Please select your gender");
        } else {
            printError("genderErr", "");
            genderErr = false;
        }

        // Validate industry
        if (industry == "") {
            printError("industryErr", "Please choose your industry");
        } else {
            printError("industryErr", "");
            industryErr = false;
        }


        // Prevent the form from being submitted if there are any errors
        if ((lastNameErr || firstNameErr || emailErr || phoneErr || genderErr || industryErr) == true) {
            console.log("false")
            return false;
        } else {
            console.log("true")
            return true;
        }
    }
}

function validateUpdateRecruiterProfileForm() {
    var ifConfirmed = confirm("Are all of your details correct?");

    if (ifConfirmed) {
        // Retrieving the values of form elements 
        var last_name = document.updateRecruiterProfileForm.last_name.value;
        var first_name = document.updateRecruiterProfileForm.first_name.value;
        var email = document.updateRecruiterProfileForm.email.value;
        var phone_number = document.updateRecruiterProfileForm.phone_number.value;

        // Defining error variables with a default value
        var lastNameErr = firstNameErr = emailErr = phoneErr = true;


        // Validate first name
        if (first_name == "") {
            printError("firstNameErr", "Please enter your First Name");
        } else {
            var regex = /^[a-zA-Z\s]+$/;
            if (regex.test(first_name) === false) {
                printError("firstNameErr", "Please enter a valid name");
            } else {
                printError("firstNameErr", "");
                firstNameErr = false;
            }
        }

        // Validate last name
        if (last_name == "") {
            printError("lastNameErr", "Please enter your Last Name");
        } else {
            var regex = /^[a-zA-Z\s]+$/;
            if (regex.test(last_name) === false) {
                printError("lastNameErr", "Please enter a valid name");
            } else {
                printError("lastNameErr", "");
                lastNameErr = false;
            }
        }

        // Validate email address
        if (email == "") {
            printError("emailErr", "Please enter your email address");
        } else {
            // Regular expression for basic email validation
            var regex = /^\S+@\S+\.\S+$/;
            if (regex.test(email) === false) {
                printError("emailErr", "Please enter a valid email address");
            } else {
                printError("emailErr", "");
                emailErr = false;
            }
        }

        // Validate phone number
        if (phone_number == "") {
            printError("phoneErr", "Please enter your Phone Number");
        } else {
            var regex = /^[0-9]\d{10}$/;
            if (regex.test(phone_number) === false) {
                printError("phoneErr", "Please enter a valid 11 digit phone number");
            } else {
                printError("phoneErr", "");
                phoneErr = false;
            }
        }

        // Prevent the form from being submitted if there are any errors
        if ((lastNameErr || firstNameErr || emailErr || phoneErr) == true) {
            console.log("false")
            return false;
        } else {
            console.log("true")
            return true;
        }
    }
}

function validatePostJobForm(job_title, job_type, job_category, location, industry, job_description,
    job_responsibilities, min_qualification, experience_level, min_year_of_experience, max_year_of_experience,
    expected_salary, gender_type, application_deadline, minimum_age, maximum_age, required_skills,
    shortlist_params, application_channel, external_application_link) {

    var ifConfirmed = confirm("Are all of these information correct?");

    if (ifConfirmed) {
        // Defining error variables with a default value

        var jobTitleErr = true;
        var jobTypeErr = true;
        var jobCategoryErr = true;
        var locationErr = true;
        var industryErr = true;
        var jobDescriptionErr = true;
        var jobResponsibilitiesErr = true;
        var minQualificationErr = true;
        var experienceLevelErr = true;
        var minYearOfExperienceErr = true;
        var maxYearOfExperienceErr = true;
        var expectedSalaryErr = true;
        var genderTypeErr = true;
        var applicationDeadlineErr = true;
        var maximumAgeErr = true;
        var minimumAgeErr = true;


        // Validate job title
        if (job_title == "") {
            printError("jobTitleErr", "Please enter a Job Title");
        } else {
            printError("jobTitleErr", "");
            jobTitleErr = false;

            /*var regex = /^[a-zA-Z\s]+$/;                
            if(regex.test(job_title) === false) {
                printError("jobTitleErr", "Please enter a valid job title");
            } else {
                printError("jobTitleErr", "");
                jobTitleErr = false;
            }*/
        }

        // Validate job type
        if (job_type == "") {
            printError("jobTypeErr", "Please select Job Type");
        } else {
            printError("jobTypeErr", "");
            jobTypeErr = false;
        }

        // Validate job category
        if (job_category == "") {
            printError("jobCategoryErr", "Please select Job Category");
        } else {
            printError("jobCategoryErr", "");
            jobCategoryErr = false;
        }

        // Validate location
        if (location == "") {
            printError("locationErr", "Please select Location");
        } else {
            printError("locationErr", "");
            locationErr = false;
        }

        // Validate industry
        if (industry == "") {
            printError("industryErr", "Please select Industry");
        } else {
            printError("industryErr", "");
            industryErr = false;
        }

        // Validate job description
        if (job_description == "") {
            printError("jobDescriptionErr", "Please enter the Job Description");
        } else {
            printError("jobDescriptionErr", "");
            jobDescriptionErr = false;
        }

        // Validate job responsibilities
        /*if(job_responsibilities == "") {
            printError("jobResponsibilitiesErr", "Please enter the Job Responsibility");
        } else if(job_responsibilities.length > 2000) {
            printError("jobResponsibilitiesErr", "Job responsibilities should not be more than 2000 characters");
        } else {
            printError("jobResponsibilitiesErr", "");
            jobResponsibilitiesErr = false;
        }*/

        // Validate min qualification
        if (min_qualification == "") {
            printError("minQualificationErr", "Please select the Min Qualification");
        } else {
            printError("minQualificationErr", "");
            minQualificationErr = false;
        }

        // Validate experience level
        if (experience_level == "") {
            printError("experienceLevelErr", "Please select the Experience Level");
        } else {
            printError("experienceLevelErr", "");
            experienceLevelErr = false;
        }

        // Validate min year of experience
        if (min_year_of_experience == "") {
            printError("minYearOfExperienceErr", "Please enter the Min Year of Experience");
        } else {
            var regex = /^[0-9]*$/;
            if (regex.test(min_year_of_experience) === false) {
                printError("minYearOfExperienceErr", "This field should only contain number");
            } else {
                printError("minYearOfExperienceErr", "");
                minYearOfExperienceErr = false;
            }
        }

        // Validate max year of experience
        if (max_year_of_experience != "") {
            var regex = /^[0-9]*$/;
            if (regex.test(max_year_of_experience) === false) {
                printError("maxYearOfExperienceErr", "This field should only contain number");
            } else {
                printError("maxYearOfExperienceErr", "");
                maxYearOfExperienceErr = false;
            }
        }

        // Validate expected salary
        if (expected_salary != "") {
            var regex = /^[0-9]*$/;
            if (regex.test(expected_salary) === false) {
                printError("expectedSalaryErr", "This field should only contain number");
            } else {
                printError("expectedSalaryErr", "");
                expectedSalaryErr = false;
            }
        } else {
            expectedSalaryErr = false;
        }

        // Validate gender type
        if (gender_type == "") {
            printError("genderTypeErr", "Please select the Gender Type");
        } else {
            printError("genderTypeErr", "");
            genderTypeErr = false;
        }

        // Validate min age
        if (minimum_age != "") {
            var regex = /^[0-9]*$/;
            if (regex.test(minimum_age) === false) {
                printError("minimumAgeErr", "This field should only contain number");
            } else {
                printError("minimumAgeErr", "");
                minimumAgeErr = false;
            }
        }

        // Validate max age
        if (maximum_age != "") {
            var regex = /^[0-9]*$/;
            if (regex.test(maximum_age) === false) {
                printError("maximumAgeErr", "This field should only contain number");
            } else {
                printError("maximumAgeErr", "");
                maximumAgeErr = false;
            }
        }

        // Validate application channel
        /* if (application_channel == "") {
             printError("applicationChannelErr", "Please select the application channel");
         } else {
             printError("applicationChannelErr", "");
             applicationChannelErr = false;
         }  */

        // Prevent the form from being submitted if there are any errors
        if ((jobTitleErr || jobTypeErr || jobCategoryErr || locationErr || industryErr ||
                jobDescriptionErr || minQualificationErr || experienceLevelErr ||
                minYearOfExperienceErr || minYearOfExperienceErr || genderTypeErr) == true) {
            console.log("false")
            return false;
        } else {
            console.log("true")
            return true;
        }
    }
}

function validatePostJobByProxyForm(job_title, job_type, job_category, location, industry, job_description,
    job_responsibilities, min_qualification, experience_level, min_year_of_experience, max_year_of_experience,
    expected_salary, gender_type, application_deadline, minimum_age, maximum_age, required_skills,
    shortlist_params, company_name, company_industry, rc_number, company_location, company_email, company_phone_number) {

    var ifConfirmed = confirm("Are all of these information correct?");

    if (ifConfirmed) {
        // Defining error variables with a default value

        var jobTitleErr = true;
        var jobTypeErr = true;
        var jobCategoryErr = true;
        var locationErr = true;
        var industryErr = true;
        var jobDescriptionErr = true;
        var jobResponsibilitiesErr = true;
        var minQualificationErr = true;
        var experienceLevelErr = true;
        var minYearOfExperienceErr = true;
        var maxYearOfExperienceErr = true;
        var expectedSalaryErr = true;
        var genderTypeErr = true;
        var applicationDeadlineErr = true;
        var maximumAgeErr = true;
        var minimumAgeErr = true;
        var companyNameErr = true;
        var companyIndustryErr = true;
        var companyLocationErr = true;


        // Validate job title
        if (job_title == "") {
            printError("jobTitleErr", "Please enter a Job Title");
        } else {
            printError("jobTitleErr", "");
            jobTitleErr = false;

            /*var regex = /^[a-zA-Z\s]+$/;                
            if(regex.test(job_title) === false) {
                printError("jobTitleErr", "Please enter a valid job title");
            } else {
                printError("jobTitleErr", "");
                jobTitleErr = false;
            }*/
        }

        // Validate job type
        if (job_type == "") {
            printError("jobTypeErr", "Please select Job Type");
        } else {
            printError("jobTypeErr", "");
            jobTypeErr = false;
        }

        // Validate job category
        if (job_category == "") {
            printError("jobCategoryErr", "Please select Job Category");
        } else {
            printError("jobCategoryErr", "");
            jobCategoryErr = false;
        }

        // Validate location
        if (location == "") {
            printError("locationErr", "Please select Location");
        } else {
            printError("locationErr", "");
            locationErr = false;
        }

        // Validate company name
        if (company_name == "") {
            printError("companyNameErr", "Please enter a Company Name");
        } else {
            printError("companyNameErr", "");
            companyNameErr = false;
        }

        // Validate company location
        if (company_location == "") {
            printError("companyLocationErr", "Please select Location");
        } else {
            printError("companyLocationErr", "");
            companyLocationErr = false;
        }

        // Validate industry
        if (industry == "") {
            printError("industryErr", "Please select Industry");
        } else {
            printError("industryErr", "");
            industryErr = false;
        }

        // Validate company industry
        if (company_industry == "") {
            printError("companyIndustryErr", "Please select Industry");
        } else {
            printError("companyIndustryErr", "");
            companyIndustryErr = false;
        }

        // Validate job description
        if (job_description == "") {
            printError("jobDescriptionErr", "Please enter the Job Description");
        } else {
            printError("jobDescriptionErr", "");
            jobDescriptionErr = false;
        }

        // Validate job responsibilities
        /*if(job_responsibilities == "") {
            printError("jobResponsibilitiesErr", "Please enter the Job Responsibility");
        } else if(job_responsibilities.length > 2000) {
            printError("jobResponsibilitiesErr", "Job responsibilities should not be more than 2000 characters");
        } else {
            printError("jobResponsibilitiesErr", "");
            jobResponsibilitiesErr = false;
        }*/

        // Validate min qualification
        if (min_qualification == "") {
            printError("minQualificationErr", "Please select the Min Qualification");
        } else {
            printError("minQualificationErr", "");
            minQualificationErr = false;
        }

        // Validate experience level
        if (experience_level == "") {
            printError("experienceLevelErr", "Please select the Experience Level");
        } else {
            printError("experienceLevelErr", "");
            experienceLevelErr = false;
        }

        // Validate min year of experience
        if (min_year_of_experience == "") {
            printError("minYearOfExperienceErr", "Please enter the Min Year of Experience");
        } else {
            var regex = /^[0-9]*$/;
            if (regex.test(min_year_of_experience) === false) {
                printError("minYearOfExperienceErr", "This field should only contain number");
            } else {
                printError("minYearOfExperienceErr", "");
                minYearOfExperienceErr = false;
            }
        }

        // Validate max year of experience
        if (max_year_of_experience != "") {
            var regex = /^[0-9]*$/;
            if (regex.test(max_year_of_experience) === false) {
                printError("maxYearOfExperienceErr", "This field should only contain number");
            } else {
                printError("maxYearOfExperienceErr", "");
                maxYearOfExperienceErr = false;
            }
        }

        // Validate expected salary
        if (expected_salary != "") {
            var regex = /^[0-9]*$/;
            if (regex.test(expected_salary) === false) {
                printError("expectedSalaryErr", "This field should only contain number");
            } else {
                printError("expectedSalaryErr", "");
                expectedSalaryErr = false;
            }
        } else {
            expectedSalaryErr = false;
        }

        // Validate gender type
        if (gender_type == "") {
            printError("genderTypeErr", "Please select the Gender Type");
        } else {
            printError("genderTypeErr", "");
            genderTypeErr = false;
        }

        // Validate min age
        if (minimum_age != "") {
            var regex = /^[0-9]*$/;
            if (regex.test(minimum_age) === false) {
                printError("minimumAgeErr", "This field should only contain number");
            } else {
                printError("minimumAgeErr", "");
                minimumAgeErr = false;
            }
        }

        // Validate max age
        if (maximum_age != "") {
            var regex = /^[0-9]*$/;
            if (regex.test(maximum_age) === false) {
                printError("maximumAgeErr", "This field should only contain number");
            } else {
                printError("maximumAgeErr", "");
                maximumAgeErr = false;
            }
        }

        // Prevent the form from being submitted if there are any errors
        if ((jobTitleErr || jobTypeErr || jobCategoryErr || locationErr || industryErr ||
                jobDescriptionErr || minQualificationErr || experienceLevelErr ||
                minYearOfExperienceErr || minYearOfExperienceErr || genderTypeErr ||
                companyNameErr || companyIndustryErr || companyLocationErr) == true) {
            console.log("false")
            return false;
        } else {
            console.log("true")
            return true;
        }
    }
}

function validateCreateAssessmentForm(assessment_name, assessment_type, job_assigned_to,
    assessment_time, assessment_description, pass_percentage) {

    var ifConfirmed = confirm("Are all of these information correct?");

    if (ifConfirmed) {
        // Defining error variables with a default value
        var assessmentNameErr = true;
        var assessmentTypeErr = true;
        var jobAssignedToErr = true;
        var assessmentTimeErr = true;
        var assessmentDescriptionErr = true;
        var passPercentageErr = true;

        // Validate assessment name
        if (assessment_name == "") {
            printError("assessmentNameErr", "Please enter a Assessment Name");
        } else {
            printError("assessmentNameErr", "");
            assessmentNameErr = false;

            /*var regex = /^[a-zA-Z0-9\s]+$/;                
            if(regex.test(assessment_name) === false) {
                printError("assessmentNameErr", "Please enter a valid assessment name");
            } else {
                printError("assessmentNameErr", "");
                assessmentNameErr = false;
            } */
        }

        // Validate assessment type
        if (assessment_type == "") {
            printError("assessmentTypeErr", "Please select an Assessment Type");
        } else {
            printError("assessmentTypeErr", "");
            assessmentTypeErr = false;
        }

        // Validate job assigned to
        if (job_assigned_to == "") {
            printError("jobAssignedToErr", "Please select Job");
        } else {
            printError("jobAssignedToErr", "");
            jobAssignedToErr = false;
        }

        // Validate assessment time
        if (assessment_time == "") {
            printError("assessmentTimeErr", "Please enter the a time");
        } else {
            var regex = /^[0-9]*$/;
            if (regex.test(assessment_time) === false) {
                printError("assessmentTimeErr", "This field should only contain number (In minutes)");
            } else {
                printError("assessmentTimeErr", "");
                assessmentTimeErr = false;
            }
        }

        // Validate pass percentage
        if (pass_percentage == "") {
            printError("passPercentageErr", "Please enter the a Pass Mark Percentage");
        } else {
            var regex = /^[0-9]*$/;
            if (regex.test(pass_percentage) === false) {
                printError("passPercentageErr", "This field should only contain number");
            } else {
                printError("passPercentageErr", "");
                passPercentageErr = false;
            }
        }

        // Validate assessment description
        if (assessment_description == "") {
            printError("assessmentDescriptionErr", "Please enter the Assessment Description or Instructions");
        } else if (assessment_description.length > 2000) {
            printError("assessmentDescriptionErr", "Assessment description should not be more than 2000 characters");
        } else {
            printError("assessmentDescriptionErr", "");
            assessmentDescriptionErr = false;
        }


        // Prevent the form from being submitted if there are any errors
        if ((assessmentNameErr || assessmentTypeErr || jobAssignedToErr || assessmentTimeErr ||
                assessmentDescriptionErr || passPercentageErr) == true) {
            console.log("false")
            return false;
        } else {
            console.log("true")
            return true;
        }
    }
}

function validateCreateInterviewForm() {
    var ifConfirmed = confirm("Are all of these information correct?");

    if (ifConfirmed) {
        // Retrieving the values of form elements 
        var interview_name = document.createInterviewForm.interview_name.value;
        var interview_date = document.createInterviewForm.interview_date.value;
        var interview_time = document.createInterviewForm.interview_time.value;
        var venue = document.createInterviewForm.venue.value;
        var dress_code = document.createInterviewForm.dress_code.value;
        var job_assigned_to = document.createInterviewForm.job_assigned_to.value;
        var interview_description = document.createInterviewForm.interview_description.value;

        // Defining error variables with a default value
        var interviewNameErr = true;
        var interviewDateErr = true;
        var interviewTimeErr = true;
        var venueErr = true;
        var dressCodeErr = true;
        var jobAssignedToErr = true;
        var interviewDescriptionErr = true;


        // Validate interview name
        if (interview_name == "") {
            printError("interviewNameErr", "Please enter your Interview Name");
        } else {
            printError("interviewNameErr", "");
            interviewNameErr = false;

            /*var regex = /^[a-zA-Z0-9\s]+$/;                
            if(regex.test(interview_name) === false) {
                printError("interviewNameErr", "Please enter a valid Interview Name");
            } else {
                printError("interviewNameErr", "");
                interviewNameErr = false;
            } */
        }

        // Validate interview date
        if (interview_date == "") {
            printError("interviewDateErr", "Please choose an interview date");
        } else {
            printError("interviewDateErr", "");
            interviewDateErr = false;
        }

        // Validate interview time
        if (interview_time == "") {
            printError("interviewTimeErr", "Please choose a time for the interview");
        } else {
            printError("interviewTimeErr", "");
            interviewTimeErr = false;
        }

        // Validate interview venue
        if (venue == "") {
            printError("venueErr", "Please enter the venue/location");
        } else {
            printError("venueErr", "");
            venueErr = false;
        }

        // Validate dress code
        //if(dress_code != "") {
        //    var regex = /^[a-zA-Z]*$/;         
        //    if(regex.test(dress_code) === false) {
        //        printError("dressCodeErr", "This field should only contain letters");
        //    } else {
        //        printError("dressCodeErr", "");
        //        dressCodeErr = false;
        //    }       
        //}

        // Validate job assigned to 
        if (job_assigned_to == "") {
            printError("jobAssignedToErr", "Please select a job");
        } else {
            printError("jobAssignedToErr", "");
            jobAssignedToErr = false;
        }

        // Prevent the form from being submitted if there are any errors
        if ((interviewNameErr || interviewDateErr || interviewTimeErr || venueErr || jobAssignedToErr) == true) {
            return false;
        } else {
            return true;
        }
    }
}

function validateUpdateCompanyProfileForm(company_name, rc_number, company_phone_number, company_email,
    industry, year_established, company_description, website, no_of_employees, address, city, state,
    country, twitter_link, instagram_link, facebook_link, linkedin_link) {

    var ifConfirmed = confirm("Are all of these information correct?");

    if (ifConfirmed) {
        var companyNameErr = true;
        var rcNumberErr = true;
        var companyPhoneNumberErr = true;
        var companyEmailErr = true;
        var industryErr = true;
        var yearEstablishedErr = true;
        var companyDescriptionErr = true;
        var websiteErr = true;
        var noOfEmployeesErr = true;
        var addressErr = true;
        var cityErr = true;
        var stateErr = true;
        var countryErr = true;
        var twitterLinkErr = true;
        var instagramLinkErr = true;
        var facebookLinkErr = true;
        var linkedinLinkErr = true;

        // Validate company name
        if (company_name == "") {
            printError("companyNameErr", "Please enter your Company Name");
        } else {
            var regex = /^[a-zA-Z\s]+$/;
            if (regex.test(company_name) === false) {
                printError("companyNameErr", "Please enter a valid Company Name");
            } else {
                printError("companyNameErr", "");
                companyNameErr = false;
            }
        }



        // Validate industry
        if (industry == "select") {
            printError("industryErr", "Please select your company's industry");
        } else {
            printError("industryErr", "");
            industryErr = false;
        }


        // Prevent the form from being submitted if there are any errors
        if ((companyNameErr || industryErr) == true) {
            return false;
        } else {
            return true;
        }
    }
}

function validateCaptcha() {
    var captcha_response = grecaptcha.getResponse();

    console.log('captcha_response - ')
    console.log(captcha_response)

    if (captcha_response.length == 0 || grecaptcha != undefined) {
        // Captcha is not Passed
        console.log(false)
        return false;
    } else {
        console.log(true)
        console.log('about to process server side validation')
            /* $.get('/captchaTest', { 'response': captcha_response }, function(response) {
                if (response == undefined && response.responseCode == undefined && response.responseDesc == undefined && response.responseCode !== 0 && response.responseDesc !== 'Success') {
                    console.log(true)
                    return true;
                }
                grecaptcha.reset();
            }); */
    }
}