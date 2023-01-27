$(document).ready(function() {

    //Get All Job Filters
    $.ajax({
        url: '/jobs/get-all-job-filters',
        type: 'get',

        success: function(data) {
            var industryContent = stateContent = jobTypeContent = skillContent = '';

            if (!data) {
                industryContent = '';
                stateContent = '';
                jobTypeContent = '';
                skillContent = '';
            } else {
                //Load industry filters
                for (var i = 0; i < data.industries.length; i++) {
                    industryContent += '<label for="" class="containerr" id="industry_label">' +
                        data.industries[i].industry_name +
                        '<input type="checkbox" ' +
                        'value="' + data.industries[i].industry_id + '" ' +
                        'name="' + data.industries[i].industry_name + '" ' +
                        'id="' + data.industries[i].industry_name + '"> \
                                            <span class="checkmark"></span> \
                                        </label>';

                }

                //Load state filters
                for (var i = 0; i < data.states.length; i++) {
                    stateContent += '<label for="" class="containerr">' +
                        data.states[i].state_name +
                        '<input type="checkbox" ' +
                        'value="' + data.states[i].state_id + '" ' +
                        'name="' + data.states[i].state_name + '" ' +
                        'id="' + data.states[i].state_name + '"> \
                                            <span class="checkmark"></span> \
                                        </label>';

                }

                //Load Job type filters
                for (var i = 0; i < data.jobTypes.length; i++) {
                    jobTypeContent += '<label for="" class="containerr">' +
                        data.jobTypes[i].job_type_name +
                        '<input type="checkbox" ' +
                        'value="' + data.jobTypes[i].job_type_id + '" ' +
                        'name="' + data.jobTypes[i].job_type_name + '" ' +
                        'id="' + data.jobTypes[i].job_type_name + '"> \
                                            <span class="checkmark"></span> \
                                        </label>';

                }

                //Load Skill filters
                for (var i = 0; i < data.skills.length; i++) {
                    skillContent += '<label for="" class="containerr">' +
                        data.skills[i].skill_name +
                        '<input type="checkbox" ' +
                        'value="' + data.skills[i].skill_id + '" ' +
                        'name="' + data.skills[i].skill_name + '" ' +
                        'id="' + data.skills[i].skill_name + '"> \
                                            <span class="checkmark"></span> \
                                        </label>';

                }
            }

            $('.industry_filter').html(industryContent);
            $('.location_filter').html(stateContent);
            $('.job_type_filter').html(jobTypeContent);
            $('.skill_filter').html(skillContent);
        },
        error: function(xhr, ajaxOptions, thrownError) {
            var errorMsg = 'All Jobs Request failed: ' + xhr.responseText;
            console.log(errorMsg)
        }
    });

    if (!getParameterByName('search')) {
        load_jobs_data();
    }

    function load_jobs_data() {
        //$('.filter_data').html('<div id="loading" style="" ></div>');

        var f_industry = get_filter('industry_filter');
        var f_state = get_filter('location_filter');
        var f_job_type = get_filter('job_type_filter');
        var f_job_category = get_filter('job_category_filter');
        var f_skill = get_filter('skill_filter');

        clearTable();

        $.ajax({
            url: '/jobs/filter-jobs',
            type: 'get',
            data: {
                f_industry: f_industry,
                f_state: f_state,
                f_job_type: f_job_type,
                f_job_category: f_job_category,
                f_skill: f_skill
            },
            success: function(data) {

                var content = '';

                if (!data && data.jobs.length == 0) {
                    content = 'No jobs found. Try another search.';
                } else {
                    for (var i = 0; i < data.jobs.length; i++) {
                        content += '<tr> \
                                        <td> \
                                            <div class="site_row"> \
                                                <p> \
                                                    <a href="/job-detail/' + data.jobs[i].job_id + '">' +
                            data.jobs[i].job_name +
                            '</a>\
                                                </p>\
                                                <p>' + truncate_long_text(data.jobs[i].job_description) + '</p>\
                                                <p><b>Date Posted:</b> ' + data.jobs[i].date_time_ago + '</p>\
                                                <p><i>' + data.jobs[i].company_name + ', ' + data.jobs[i].state_name + '</i></p>\
                                            </div>\
                                            <div class="candidates_for_open_job">\
                                                <a href="/job-detail/' + data.jobs[i].job_id + '"> \
                                                    View more \
                                                </a> \
                                            </div> \
                                            <hr>\
                                        </td>\
                                    </tr>';

                    }
                }

                $('#jobs_data').html(content);

                $("#jobs_table").DataTable({
                    'paging': true,
                    'processing': true,
                    'aaSorting': [],
                    'language': {
                        'loadingRecords': '&nbsp;',
                        'processing': 'Loading...',
                        'sEmptyTable': 'No jobs found. Try another search.'
                    }
                });
            }
        });
    }

    function get_filter(id_name) {
        var filter = [];
        $('#' + id_name + ' input:checked').each(function() {
            filter.push($(this).attr('value'));
        });

        return filter;
    }

    function filter_jobs_data() {
        var f_industry = get_filter('industry_filter');
        var f_state = get_filter('location_filter');
        var f_job_type = get_filter('job_type_filter');
        var f_job_category = get_filter('job_category_filter');
        var f_skill = get_filter('skill_filter');

        clearTable();

        $.ajax({
            url: '/jobs/filter-jobs',
            type: 'get',
            data: {
                f_industry: f_industry,
                f_state: f_state,
                f_job_type: f_job_type,
                f_job_category: f_job_category,
                f_skill: f_skill
            },
            success: function(data) {

                var content = '';

                if (!data && data.jobs.length == 0) {
                    content = '';
                } else {
                    for (var i = 0; i < data.jobs.length; i++) {
                        content += '<tr> \
                                        <td> \
                                            <div class="site_row"> \
                                                <p> \
                                                    <a href="/job-detail/' + data.jobs[i].job_id + '">' +
                            data.jobs[i].job_name +
                            '</a>\
                                                </p>\
                                                <p>' + truncate_long_text(data.jobs[i].job_description) + '</p>\
                                                <p><b>Date Posted:</b> ' + data.jobs[i].date_time_ago + '</p>\
                                                <p><i>' + data.jobs[i].company_name + ', ' + data.jobs[i].state_name + '</i></p>\
                                            </div>\
                                            <div class="candidates_for_open_job">\
                                                <a href="/job-detail/' + data.jobs[i].job_id + '"> \
                                                    View more \
                                                </a> \
                                            </div> \
                                            <hr>\
                                        </td>\
                                    </tr>';

                    }
                }


                $('#jobs_data').html(content);

                $("#jobs_table").DataTable({
                    'paging': true,
                    'processing': true,
                    'aaSorting': [],
                    'language': {
                        'loadingRecords': '&nbsp;',
                        'processing': 'Loading...',
                        'sEmptyTable': 'No jobs matching these filters. Try another search.'
                    }
                });

            }
        });
    }

    function clearTable() {
        var table = $('#jobs_table').DataTable();
        //clear datatable
        table.clear().draw();

        //destroy datatable
        table.destroy();
    }

    function getParameterByName(name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) { return null };
        if (!results[2]) { return '' };

        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    function truncate_long_text(long_text) {
        var truncated_string = '';

        if (long_text.length > 100) {
            truncated_string = long_text.substr(0, 200 - 1).trim() + ' [...]  ';
        } else {
            truncated_string = long_text;
        }

        return truncated_string;
    }

    $(document).on("click", ".containerr", function() {
        filter_jobs_data();
    });

    if (getParameterByName('search')) {
        var keyword = getParameterByName('search');
        $("#keyword").val(keyword);
        searchKeyword(keyword);
    }

    $("#search_btn").click(function() {
        var keyword = $("#keyword").val();
        searchKeyword(keyword);
    });

    $('#keyword').keypress(function(e) {
        if (e.which == 13) {
            var keyword = $("#keyword").val();
            searchKeyword(keyword);

            return false;
        }
    });

    //Search Keyword od Skill
    function searchKeyword(keyword) {
        clearTable();

        $.ajax({
            url: '/jobs/keyword-search',
            type: 'get',
            data: {
                keyword: keyword
            },

            success: function(data) {
                var content = '';

                if (!data || data.jobs.length == 0) {
                    var no_jobs_content = 'No jobs with <b>' + keyword + '</b> found. Try another search.';
                    //$('#no_jobs_text').html(no_jobs_content);
                } else {
                    for (var i = 0; i < data.jobs.length; i++) {
                        content += '<tr> \
                                        <td> \
                                            <div class="site_row"> \
                                                <p> \
                                                    <a href="/job-detail/' + data.jobs[i].job_id + '">' +
                            data.jobs[i].job_name +
                            '</a>\
                                                </p>\
                                                <p>' + truncate_long_text(data.jobs[i].job_description) + '</p>\
                                                <p><b>Date Posted:</b> ' + data.jobs[i].date_time_ago + '</p>\
                                                <p><i>' + data.jobs[i].company_name + ', ' + data.jobs[i].state_name + '</i></p>\
                                            </div>\
                                            <div class="candidates_for_open_job">\
                                                <a href="/job-detail/' + data.jobs[i].job_id + '"> \
                                                    View more \
                                                </a> \
                                            </div> \
                                            <hr>\
                                        </td>\
                                    </tr>';

                    }
                }


                $('#jobs_data').html(content);

                $("#jobs_table").DataTable({
                    'paging': true,
                    'processing': true,
                    'aaSorting': [],
                    'language': {
                        'loadingRecords': '&nbsp;',
                        'processing': 'Loading...',
                        'sEmptyTable': 'No jobs matching <b>' + keyword + '</b>. Try another search.'
                    }
                });
            },
            error: function(xhr, ajaxOptions, thrownError) {
                var errorMsg = 'All Jobs Request failed: ' + xhr.responseText;
                console.log(errorMsg)
            }
        });
    }

    function clearTable() {
        var table = $('#jobs_table').DataTable();
        //clear datatable
        table.clear().draw();

        //destroy datatable
        table.destroy();
    }

    function truncate_long_text(long_text) {
        var truncated_string = '';

        if (long_text.length > 100) {
            truncated_string = long_text.substr(0, 200 - 1).trim() + ' [...]  ';
        } else {
            truncated_string = long_text;
        }

        return truncated_string;
    }

    function getParameterByName(name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) { return null };
        if (!results[2]) { return '' };

        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    //Get All Company Industries
    $.ajax({
        url: '/jobs/get-all-industries',
        type: 'get',

        success: function(data) {
            var industryContent = '';

            //Load all Industry
            if (!data.industries) {
                industryContent = '<option value="">Select Industry</option>';
            } else {
                industryContent = '<option value="">Select Industry</option>';

                for (var i = 0; i < data.industries.length; i++) {
                    industryContent += '<option value="' + data.industries[i].industry_id + '">' +
                        data.industries[i].industry_name +
                        '</option>';
                }
            }

            $('#industry').html(industryContent);
        },
        error: function(xhr, ajaxOptions, thrownError) {
            var errorMsg = 'All Job Post Params Request failed: ' + xhr.responseText;
            console.log(errorMsg)
        }
    });

    //Get all assessment candidates
    $.ajax({
        url: '/assessments/get-all-assessment-candidates',
        type: 'post',
        data: {
            assessment_id: '<%=assessmentData.assessment_id%>'
        },

        success: function(data) {
            var totalCandidatesCount = 0;
            var totalPassedCandidatesCount = 0;
            var totalFailedCandidatesCount = 0;
            var averageScore = 0;

            var content = '';

            if (!data || data.candidates.length == 0) {
                content = '';
            } else {
                averageScore = data.average_score;

                for (var i = 0; i < data.candidates.length; i++) {
                    totalCandidatesCount += 1;

                    var candidateFullName = data.candidates[i].first_name + ' ' + data.candidates[i].last_name;

                    var firstRowContent = '<tr> \
                                                <td class="cand_image"> \
                                                    <div> \
                                                        <img src="' + data.candidates[i].photo_url + '" alt="User Image"> \
                                                    </div> \
                                                </td> \
                                                <td>' + candidateFullName + '</td> \
                                                <td>' + data.candidates[i].phone_number + '</td> \
                                                <td>' + data.candidates[i].date_attempted + '</td> \
                                                <td>' + data.candidates[i].time_spent + '</td> \
                                                <td>' + data.candidates[i].score + '%</td>';

                    var gradeContent = '';

                    if (data.candidates[i].grade === 'Passed') {
                        totalPassedCandidatesCount = +1;
                        gradeContent = '<td class="assessment_passed">' + data.candidates[i].grade + '</td></tr>';
                    } else {
                        totalFailedCandidatesCount = +1;
                        gradeContent = '<td class="assessment_failed">' + data.candidates[i].grade + '</td></tr>';
                    }


                    content += (firstRowContent + gradeContent);
                }
            }

            var totalCandidatesCountContent = '<h4 class="mb-2">' + totalCandidatesCount + '</h4><p>Passed</p>';
            var totalPassedCandidatesCountContent = '<h4 class="mb-2">' + totalPassedCandidatesCount + '</h4><p>Passed</p>';
            var totalFailedCandidatesCountContent = '<h4 class="mb-2">' + totalFailedCandidatesCount + '</h4><p>Failed</p>';
            var averageScoreContent = '<h4 class="mb-2">' + averageScore + '</h4><p>Avg. Score</p>';

            $('#candidates_data').html(content);
            $('#total_candidates').html(totalCandidatesCountContent);
            $('#total_passed').html(totalPassedCandidatesCountContent);
            $('#total_failed').html(totalFailedCandidatesCountContent);
            $('#average_score').html(averageScoreContent);

            $("#candidates_table").DataTable({
                'paging': true,
                'processing': true,
                'language': {
                    'loadingRecords': '&nbsp;',
                    'processing': 'Loading...'
                }
            });
        },
        error: function(xhr, ajaxOptions, thrownError) {
            var errorMsg = 'All Candidates Request failed: ' + xhr.responseText;
            console.log(errorMsg)
        }
    });

    //Get All CV Search Parameters
    $.ajax({
        url: '/jobs/get-all-cv-search-params',
        type: 'get',

        success: function(data) {
            var stateContent = '';
            var qualificationContent = '';

            //Load all States
            if (!data.states) {
                stateContent = '<option value="">Select Location</option>';
            } else {
                stateContent = '<option value="">Select Location</option>';

                for (var i = 0; i < data.states.length; i++) {
                    stateContent += '<option value="' + data.states[i].state_id + '">' +
                        data.states[i].state_name +
                        '</option>';
                }
            }

            //Load all Qualifications
            if (!data.qualifications) {
                qualificationContent = '<option value="">Select Qualification</option>';
            } else {
                qualificationContent = '<option value="">Select Qualification</option>';

                for (var i = 0; i < data.qualifications.length; i++) {
                    qualificationContent += '<option value="' + data.qualifications[i].qualification_id + '">' +
                        data.qualifications[i].qualification_name +
                        '</option>';
                }
            }


            $('#location').html(stateContent);
            $('#education_level').html(qualificationContent);
        },
        error: function(xhr, ajaxOptions, thrownError) {
            var errorMsg = 'All CV Search Params Request failed: ' + xhr.responseText;
            console.log(errorMsg)
        }
    });

    //Search Talents
    $('#search_btn').click(function() {
        $('#search_btn').html('<button class="normal_btn"><i class="fa fa-spinner fa-spin"></i> Loading</button>');

        var job_title = $('#job_title').val();
        var keyword = $('#keyword').val();
        var location = $('#location').val();
        var education_level = $('#education_level').val();

        searchTalents(job_title, keyword, location, education_level);
    });

    function searchTalents(job_title, keyword, location, education_level) {

        clearTable();

        //search talents
        $.ajax({
            url: '/recruiters/search-talents',
            type: 'post',
            data: {
                job_title: job_title,
                keyword: keyword,
                location: location,
                education_level: education_level
            },

            success: function(data) {
                var content = '';

                if (!data || data.talents.length == 0) {
                    //content = 'No data Available. Please try the search again';
                    $('#result_text_box').html('<p style="color:green;">Search complete but 0 results. Please try another search.</p>');
                    $('#search_btn').html('<button class="normal_btn">Search</button>');
                } else {
                    for (var i = 0; i < data.talents.length; i++) {

                        var full_name = data.talents[i].first_name + ' ' + data.talents[i].last_name;

                        var picture = typeof data.talents[i].photo_url != 'undefined' && data.talents[i].photo_url != null &&
                            data.talents[i].photo_url != 'null' && (data.talents[i].photo_url != '') ?
                            data.talents[i].photo_url : '/images/no-user.png';

                        var profile_summary = typeof data.talents[i].profile_summary != 'undefined' &&
                            data.talents[i].profile_summary != 'null' &&
                            data.talents[i].profile_summary != null &&
                            data.talents[i].profile_summary != '' ?
                            data.talents[i].profile_summary : 'No personal summary provided';


                        var tagline = typeof data.talents[i].tagline != 'undefined' && data.talents[i].tagline != null &&
                            data.talents[i].tagline != 'null' && data.talents[i].tagline != '' ?
                            data.talents[i].tagline : '';


                        content += '<tr> \
                                        <td> \
                                            <div class="site_row job_desc_details job_desc_content talent_pool_cvs"> \
                                                <div class="flex_row_justify_between_align_center job_role_n_time"> \
                                                    <div class="flex_row_align_center_justify_start"> \
                                                        <div class="mr-3 candidate_imag"> \
                                                            <img src="' + picture + '" alt="Talent Picture"> \
                                                        </div> \
                                                        <div class="flex_col"> \
                                                            <div> \
                                                                <p>' + full_name + '</p> \
                                                            </div> \
                                                            <div class="stu_grade_n_exp"> \
                                                                <span>' + tagline + '</span> \
                                                            </div> \
                                                        </div> \
                                                    </div> \
                                                    <div class="invite_btn"> \
                                                        <button data-toggle="modal" data-target="#"> \
                                                            Purchase CV \
                                                        </button> \
                                                    </div> \
                                                </div> \
                                                <div class="cv_description_wrapper"> \
                                                    <div class="site_row3 prev_job_div"> \
                                                        <div class="site_row3 prev_job_header"> \
                                                            <h5>Summary</h5> \
                                                        </div> \
                                                        <div class="site_row3 prev_job_list"> \
                                                            <p>' + truncate_long_text(profile_summary) + '</p> \
                                                        </div> \
                                                    </div> \
                                                </div> \
                                            </div> \
                                        </td> \
                                    </tr>';
                    }

                    $('#result_text_box').html('<p style="color:green;">Search Complete. View results below.</p>');
                    $('#search_btn').html('<button class="normal_btn">Search</button>');
                }

                $('#talents_box').html(content);

                $("#talents_table").DataTable({
                    'paging': true,
                    'processing': true,
                    'aaSorting': [],
                    'language': {
                        'loadingRecords': '&nbsp;',
                        'processing': 'Loading...',
                        'sEmptyTable': 'No Talents matching these filters. Try another search.'
                    }
                });
            },
            error: function(xhr, ajaxOptions, thrownError) {
                var errorMsg = 'All Talents Request failed: ' + xhr.responseText;
                console.log(errorMsg)
            }
        });
    }

    function clearTable() {
        var table = $('#talents_table').DataTable();
        //clear datatable
        table.clear().draw();

        //destroy datatable
        table.destroy();
    }

    function truncate_long_text(long_text) {
        var truncated_string = '';

        if (long_text.length > 100) {
            truncated_string = long_text.substr(0, 500 - 1).trim() + ' [...]  ';
        } else {
            truncated_string = long_text;
        }

        return truncated_string;
    }

    // Defining a function to display error message
    function printError(elemId, hintMsg) {
        document.getElementById(elemId).innerHTML = hintMsg;
    }

    $('#year_established').datepicker({
        maxDate: new Date(), // Now can select only dates, which goes after today
        language: 'en',
        dateFormat: 'dd-mm-yyyy'
    });

    var count = 1;

    $("#add_new_team_member_btn").click(function() {

        count += 1;

        var add_new_team_member = '<div class="row"> \
                                        <div class="col-md-8"> \
                                            <div class="input_div"> \
                                                <label for="new_recruiter_email_' + count + '"> Team Member’s Email Address</label> \
                                                <input type="email" name="new_recruiter_email[]" id="new_recruiter_email_' + count + '"> \
                                            </div> \
                                        </div> \
                                        <div class="col-md-4"> \
                                            <div class="input_div"> \
                                                <label for="access_level">Access Level</label> \
                                                <select name="access_level" form="access_level"> \
                                                    <option value="admin">Admin</option> \
                                                </select> \
                                            </div> \
                                        </div> \
                                    </div>';

        $("#add_new_team_member_box").append(add_new_team_member);
    });

    $("#invite_team_members_btn").click(function() {
        var ifConfirmed = confirm("Are you sure you want to add these teammate(s)?");

        if (ifConfirmed) {
            var emails = [];
            $("input[name='new_recruiter_email[]']").each(function() {
                emails.push($(this).val());
            });

            createTeamMate(emails);
        }
    });

    function createTeamMate(emails) {
        //Invite team members
        $.ajax({
            url: '/recruiters/add-teammates',
            type: 'post',
            data: {
                emails: JSON.stringify(emails)
            },

            success: function(data) {
                var content = '';

                if (!data || data.result == false) {
                    location.replace('/recruiters/settings?f=a_t&r=u_e');
                } else {
                    location.replace('/recruiters/settings?f=a_t&r=s');
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                var errorMsg = 'Add team member Request failed: ' + xhr.responseText;
                console.log(errorMsg)
            }
        });
    }

    //Get All Company members
    $.ajax({
        url: '/recruiters/get-all-company-teammates',
        type: 'get',

        success: function(data) {
            var teamMemberContent = '';

            if (!data) {
                teamMemberContent = '<option value="4">Bachelor Degree</option>';
            } else {
                for (var i = 0; i < data.teammates.length; i++) {
                    teamMemberContent += '<div class="flex_row_align_end_n_justify_between invited_members"> \
                                                <div> \
                                                    <div class="site_row role_mail_head"> \
                                                        <p>Email Address</p> \
                                                    </div> \
                                                    <div class="site_row row_mail_txt"> \
                                                        <p>' + data.teammates[i].email + '</p> \
                                                    </div> \
                                                </div> \
                                                <div> \
                                                    <div class="site_row role_level"> \
                                                        <p>Access Level</p> \
                                                    </div> \
                                                    <div class="site_row role_name"> \
                                                        <p>' + data.teammates[i].role_name + '</p> \
                                                    </div> \
                                                </div> \
                                                <div class="flex_row desc_actions"> \
                                                    <div class="mr-3"> \
                                                        <i class="fas fa-pencil-alt"></i> \
                                                    </div> \
                                                    <div> \
                                                        <i class="far fa-trash-alt"></i> \
                                                    </div> \
                                                </div> \
                                            </div>';
                }
            }

            $('#company_team_members_box').html(teamMemberContent);
        },
        error: function(xhr, ajaxOptions, thrownError) {
            var errorMsg = 'Load Team Members Request failed: ' + xhr.responseText;
            console.log(errorMsg)
        }
    });

    $('#profile_picture').on('change', function() {
        var files = $(this).get(0).files;

        if (files.length > 0) {

            var formData = new FormData();

            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                formData.append('profile_picture', file, file.name);
            }

            $.ajax({
                url: '/recruiters/upload-profile-picture',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,

                success: function(data) {
                    console.log(data);

                    if (data) {
                        $('#upload_profile_pic_modal').hide();
                        $('body').removeClass('modal-open');
                        $('.modal-backdrop').remove();

                        if (data.status == 'success') {

                            var new_profile_pic = data.photo_url;

                            $('#user_profile_pic').attr("src", new_profile_pic);
                            $('#header_user_profile_pic').attr("src", new_profile_pic);

                            swal({
                                title: 'Profile Picture Uploaded successfully!',
                                type: 'success'
                            });
                        } else {
                            swal({
                                title: 'Profile Picture Upload failed. Please try again',
                                type: 'error'
                            });
                        }

                    }
                },

                xhr: function() {
                    // create an XMLHttpRequest
                    var xhr = new XMLHttpRequest();
                    // listen to the 'progress' event
                    xhr.upload.addEventListener('progress', function(evt) {
                        if (evt.lengthComputable) {
                            // calculate the percentage of upload completed
                            var percentComplete = evt.loaded / evt.total;
                            percentComplete = parseInt(percentComplete * 100);
                            // update the Bootstrap progress bar with the new percentage
                            $('.progress-bar').text(percentComplete + '%');
                            $('.progress-bar').width(percentComplete + '%');
                            // once the upload reaches 100%, set the progress bar text to done
                            if (percentComplete === 100) {
                                $('.progress-bar').html('Done');
                            }
                        }
                    }, false);
                    return xhr;
                }
            });
        }
    });

    //Get All Job Post Params
    $.ajax({
        url: '/jobs/get-all-job-post-params',
        type: 'get',

        success: function(data) {

            var stateContent = '';
            var industryContent = '';

            //Load all State
            if (!data.states) {
                stateContent = '<option value="">Select Location</option>';
            } else {
                stateContent = '<option value="">Select Location</option>';

                for (var i = 0; i < data.states.length; i++) {
                    stateContent += '<option value="' + data.states[i].state_id + '">' +
                        data.states[i].state_name +
                        '</option>';
                }
            }

            //Load all Industry
            if (!data.industries) {
                industryContent = '<option value="">Select Industry</option>';
            } else {
                industryContent = '<option value="">Select Industry</option>';

                for (var i = 0; i < data.industries.length; i++) {
                    industryContent += '<option value="' + data.industries[i].industry_id + '">' +
                        data.industries[i].industry_name +
                        '</option>';
                }
            }

            $('#state').html(stateContent);
            $('#industry').html(industryContent);
        },
        error: function(xhr, ajaxOptions, thrownError) {
            var errorMsg = 'Params Request failed: ' + xhr.responseText;
            console.log(errorMsg)
        }
    });

    function checkIfUndefined(value) {
        return typeof value != 'undefined' || value != null || value !== 'null' || value !== 'NULL' ? value : '';
    }

    //Get Company info
    $.ajax({
        url: '/recruiters/get-company-info',
        type: 'post',
        data: {
            company_id: "<%=data.company_id %>"
        },

        success: function(data) {
            if (data) {
                console.log(data)

                var company_name = checkIfUndefined(data.companyInfo.company_name);
                var rc_number = checkIfUndefined(data.companyInfo.rc_number);
                var company_phone_number = checkIfUndefined(data.companyInfo.company_phone_number);
                var company_email = checkIfUndefined(data.companyInfo.company_email);
                var industry = checkIfUndefined(data.companyInfo.industry);
                var year_established = checkIfUndefined(data.companyInfo.year_established);
                var website = checkIfUndefined(data.companyInfo.website);
                var no_of_employees = checkIfUndefined(data.companyInfo.no_of_employees);
                var address = checkIfUndefined(data.companyInfo.address);
                var city = checkIfUndefined(data.companyInfo.city);
                var state = checkIfUndefined(data.companyInfo.state);
                var country = checkIfUndefined(data.companyInfo.country);
                var twitter_link = checkIfUndefined(data.companyInfo.twitter_link);
                var instagram_link = checkIfUndefined(data.companyInfo.instagram_link);
                var facebook_link = checkIfUndefined(data.companyInfo.facebook_link);
                var linkedin_link = checkIfUndefined(data.companyInfo.linkedin_link);
                var company_description = checkIfUndefined(data.companyInfo.company_description);

                console.log('industry: ' + industry)
                console.log('state: ' + state)

                $('#company_name').val(company_name);
                $('#rc_number').val(rc_number);
                $('#company_phone_number').val(company_phone_number);
                $('#company_email').val(company_email);
                $('#industry').val(industry);
                $('#year_established').val(year_established);
                $('#company_website').val(website);
                $('#no_of_employees').val(no_of_employees);
                $('#address').val(address);
                $('#city').val(city);
                $('#state').val(state);
                $('#country').val(country);
                $('#twitter_link').val(twitter_link);
                $('#instagram_link').val(instagram_link);
                $('#facebook_link').val(facebook_link);
                $('#linkedin_link').val(linkedin_link);
                $('#company_description').val(company_description);
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            var errorMsg = 'Load Team Members Request failed: ' + xhr.responseText;
            console.log(errorMsg)
        }
    });

    var dataFromTheEditor;
    ClassicEditor
        .create(document.querySelector('#company_description'), {
            toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
            heading: {
                options: [
                    { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                    { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                    { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
                ]
            }
        })
        .then(editor => {
            dataFromTheEditor = editor; // Save for later use.
        })
        .catch(error => {
            console.error(error);
        });

    function getDataFromTheEditor() {
        return dataFromTheEditor.getData();
    }

    $("#update_company_profile_btn").click(function() {
        var company_name = $.trim($('#company_name').val());
        var rc_number = $.trim($('#rc_number').val());
        var company_phone_number = $.trim($('#company_phone_number').val());
        var company_email = $.trim($('#company_email').val());
        var industry = $.trim($('#industry').val());
        var year_established = $.trim($('#year_established').val());
        var company_description = $.trim(getDataFromTheEditor());
        var company_website = $.trim($('#company_website').val());
        var no_of_employees = $.trim($('#no_of_employees').val());
        var address = $.trim($('#address').val());
        var city = $.trim($('#city').val());
        var state = $.trim($('#state').val());
        var country = $.trim($('#country').val());
        var twitter_link = $.trim($('#twitter_link').val());
        var instagram_link = $.trim($('#instagram_link').val());
        var facebook_link = $.trim($('#facebook_link').val());
        var linkedin_link = $.trim($('#linkedin_link').val());

        var ifValidated = validateUpdateCompanyProfileForm(company_name, rc_number, company_phone_number,
            company_email, industry, year_established, company_description, company_website, no_of_employees,
            address, city, state, country, twitter_link, instagram_link, facebook_link, linkedin_link);

        if (ifValidated) {
            updateCompanyProfileForm(company_name, rc_number, company_phone_number, company_email, industry,
                year_established, company_description, company_website, no_of_employees, address, city,
                state, country, twitter_link, instagram_link, facebook_link, linkedin_link);
        }
    });

    function updateCompanyProfileForm(company_name, rc_number, company_phone_number, company_email, industry,
        year_established, company_description, website, no_of_employees, address, city, state, country,
        twitter_link, instagram_link, facebook_link, linkedin_link) {

        $.ajax({
            url: '/recruiters/update',
            type: 'post',
            data: {
                company_name: company_name,
                rc_number: rc_number,
                company_phone_number: company_phone_number,
                company_email: company_email,
                industry: industry,
                year_established: year_established,
                company_description: company_description,
                company_website: company_website,
                no_of_employees: no_of_employees,
                address: address,
                city: city,
                state: state,
                country: country,
                twitter_link: twitter_link,
                instagram_link: instagram_link,
                facebook_link: facebook_link,
                linkedin_link: linkedin_link
            },

            success: function(data) {
                console.log('DONE')
                console.log(data)
            },
            error: function(xhr, ajaxOptions, thrownError) {
                var errorMsg = 'Post Job Request failed: ' + xhr.responseText;
                console.log(errorMsg)
            }
        });
    }



});

function printError(elemId, hintMsg) {
    document.getElementById(elemId).innerHTML = hintMsg;
}