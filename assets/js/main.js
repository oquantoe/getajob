$(document).ready(function() {

    $('.register_section_link > #candidate_form_link').click(function() {

        $(".register_section_link div").not(this).removeClass("active");
        $(this).addClass("active");

        $("#employer_form").not("#candidate_form").fadeOut(300);
        $("#candidate_form").delay(300).fadeIn();
    })

    $('.register_section_link > #employer_form_link').click(function() {

        $(".register_section_link div").not(this).removeClass("active");
        $(this).addClass("active");

        $("#candidate_form").not("#employer_form").fadeOut(300);
        $("#employer_form").delay(300).fadeIn();
    })


    var container_width = 340 * $(".job").length;
    $(".jobs_slider_wrapper").css("width", container_width + "px");

    // dashboard Script 
    $('#create_account_link').click(function(e) {
        e.preventDefault();

        // $(".register_section_link div").not(this).removeClass("active");
        $(this).addClass("active");

        $("[id*='dashB_wellcome_']").not("#dashB_wellcome_create_account").fadeOut(300);
        $("#dashB_wellcome_create_account").delay(300).fadeIn();
    })

    $('#upload_resume_link').click(function(e) {
        e.preventDefault();

        // $(".register_section_link div").not(this).removeClass("active");
        $(this).addClass("active");

        $("[id*='dashB_wellcome_']").not("#dashB_wellcome_upload_resume").fadeOut(300);
        $("#dashB_wellcome_upload_resume").delay(300).fadeIn();
    })

    $('#start_applying_link').click(function(e) {
        e.preventDefault();

        // $(".register_section_link div").not(this).removeClass("active");
        $(this).addClass("active");

        $("[id*='dashB_wellcome_']").not("#dashB_wellcome_start_applying").fadeOut(300);
        $("#dashB_wellcome_start_applying").delay(300).fadeIn();
    })


    $('.dashboard_links a').click(function() {
        // e.preventDefault();

        $(".dashboard_links a").not(this).removeClass("active");
        $(this).addClass("active");

    })

    // New-----------

    // $('.profile_reg_progress > div').click(function(e){
    //     e.preventDefault();

    //     // $("step_one_link").not(this).removeClass("active");
    //     $(this).addClass("active");

    // })

    // $('.step_one_link').click(function(e){
    //     e.preventDefault();

    //     $("[id*='form_step_']").not("#form_step_one").fadeOut(300);    
    //     $("#form_step_one").delay(300).fadeIn();  
    // })

    // $('.step_two_link').click(function(e){
    //     e.preventDefault();

    //     $("[id*='form_step_']").not("#form_step_three").fadeOut(300);    
    //     $("#form_step_three").delay(300).fadeIn();  

    // })

    // $('.step_three_link').click(function(e){
    //     e.preventDefault();

    //     $("[id*='form_step_']").not("#form_step_five").fadeOut(300);    
    //     $("#form_step_five").delay(300).fadeIn();  
    // })

    // $('.step_four_link').click(function(e){
    //     e.preventDefault();

    //     $("[id*='form_step_']").not("#form_step_seven").fadeOut(300);    
    //     $("#form_step_seven").delay(300).fadeIn();  
    // })



    $('#goto_next_two').click(function(e) {
        e.preventDefault();

        $('.profile_reg_progress > div.step_two_link').addClass("active");

        $("[class*='profile_form_header']").not(".step_two_header").fadeOut(300);
        $(".step_two_header").delay(300).fadeIn();

        $("[id*='form_step_']").not("#form_step_two").fadeOut(300);
        $("#form_step_two").delay(300).fadeIn();
    })

    $('#goto_next_three').click(function(e) {
        e.preventDefault();

        $('.profile_reg_progress > div.step_three_link').addClass("active");

        $("[class*='profile_form_header']").not(".step_three_header").fadeOut(300);
        $(".step_three_header").delay(300).fadeIn();

        $("[id*='form_step_']").not("#form_step_three").fadeOut(300);
        $("#form_step_three").delay(300).fadeIn();
    })

    $('#goto_next_four').click(function(e) {
        e.preventDefault();

        $('.profile_reg_progress > div.step_four_link').addClass("active");

        $("[class*='profile_form_header']").not(".step_four_header").fadeOut(300);
        $(".step_four_header").delay(300).fadeIn();

        $("[id*='form_step_']").not("#form_step_four").fadeOut(300);
        $("#form_step_four").delay(300).fadeIn();
    })

    $('#goto_next_five').click(function(e) {
        e.preventDefault();

        $('.profile_reg_progress > div.step_four_link').addClass("active");

        $("[class*='profile_form_header']").not(".step_five_header").fadeOut(300);
        $(".step_five_header").delay(300).fadeIn();

        $("[id*='form_step_']").not("#form_step_five").fadeOut(300);
        $("#form_step_five").delay(300).fadeIn();
    })


    $('#goto_next_six').click(function(e) {
        e.preventDefault();

        $("[class*='profile_form_header']").not(".step_five_header").fadeOut(300);
        $(".step_five_header").delay(300).fadeIn();

        $("[id*='form_step_']").not("#form_step_six").fadeOut(300);
        $("#form_step_six").delay(300).fadeIn();
    })

    $('#goto_next_seven').click(function(e) {
        e.preventDefault();

        $('.profile_reg_progress > div.step_four_link').addClass("active");

        $("[class*='profile_form_header']").not(".step_six_header").fadeOut(300);
        $(".step_six_header").delay(300).fadeIn();

        $("[id*='form_step_']").not("#form_step_seven").fadeOut(300);
        $("#form_step_seven").delay(300).fadeIn();
    })


    //Back buttons
    $('#gobackto_step_four').click(function(e) {
        e.preventDefault();

        $('.profile_reg_progress > div.step_five_link').removeClass("active");

        $("[class*='profile_form_header']").not(".step_four_header").fadeOut(300);
        $(".step_four_header").delay(300).fadeIn();

        $("[id*='form_step_']").not("#form_step_four").fadeOut(300);
        $("#form_step_four").delay(300).fadeIn();
    });

    $('#gobackto_step_three').click(function(e) {
        e.preventDefault();

        $('.profile_reg_progress > div.step_four_link').removeClass("active");

        $("[class*='profile_form_header']").not(".step_three_header").fadeOut(300);
        $(".step_three_header").delay(300).fadeIn();

        $("[id*='form_step_']").not("#form_step_three").fadeOut(300);
        $("#form_step_three").delay(300).fadeIn();
    });

    $('#gobackto_step_two').click(function(e) {
        e.preventDefault();

        $('.profile_reg_progress > div.step_three_link').removeClass("active");

        $("[class*='profile_form_header']").not(".step_two_header").fadeOut(300);
        $(".step_two_header").delay(300).fadeIn();

        $("[id*='form_step_']").not("#form_step_two").fadeOut(300);
        $("#form_step_two").delay(300).fadeIn();
    });

    $('#gobackto_step_one').click(function(e) {
        e.preventDefault();

        $('.profile_reg_progress > div.step_two_link').removeClass("active");

        $("[class*='profile_form_header']").not(".step_one_header").fadeOut(300);
        $(".step_one_header").delay(300).fadeIn();

        $("[id*='form_step_']").not("#form_step_one").fadeOut(300);
        $("#form_step_one").delay(300).fadeIn();
    });



    $('.job_categories > div > a').click(function() {
        // e.preventDefault();

        $(".job_categories > div > a").not(this).removeClass("active");
        $(this).addClass("active");

    })

    // Settings



    // End of settings

    $('.xxxx > div').click(function(e) {
        e.preventDefault();

        $(".xxxx > div").not(this).removeClass("active");
        $(this).addClass("active");

    })

    $('#personal_profile_settings').click(function(e) {
        e.preventDefault();

        $(".change_password").fadeOut(300);
        $(".update_profile").delay(300).fadeIn();
    })

    $('#password_profile_settings').click(function(e) {
        e.preventDefault();

        $(".update_profile").fadeOut(300);
        $(".change_password").delay(300).fadeIn();
    })

    // End of dashboard Script

    // recruiters Setting
    $('.vvvv > div').click(function(e) {
        e.preventDefault();

        $(".vvvv > div").not(this).removeClass("active");
        $(this).addClass("active");

    })

    $('#personal_profile_settings_rec').click(function(e) {
        e.preventDefault();

        $("[id*='_account_setting_rec']").not("#profile_account_setting_rec").fadeOut(300);
        $("#profile_account_setting_rec").delay(300).fadeIn();

    })

    $('#password_profile_settings_rec').click(function(e) {
        e.preventDefault();

        $("[id*='_account_setting_rec']").not("#password_account_setting_rec").fadeOut(300);
        $("#password_account_setting_rec").delay(300).fadeIn();
    })

    $('#company_profile_settings_rec').click(function(e) {
        e.preventDefault();

        $("[id*='_account_setting_rec']").not("#company_account_setting_rec").fadeOut(300);
        $("#company_account_setting_rec").delay(300).fadeIn();
    })

    $('#team_profile_settings_rec').click(function(e) {
        e.preventDefault();

        $("[id*='_account_setting_rec']").not("#intTeam_account_setting_rec").fadeOut(300);
        $("#intTeam_account_setting_rec").delay(300).fadeIn();
    });

    $('#add_new_team').click(function(e) {
        e.preventDefault();

        $("[id*='_account_setting_rec']").not("#addTeam_account_setting_rec").fadeOut(300);
        $("#addTeam_account_setting_rec").delay(300).fadeIn();
    });


    // Search Page
    $('.sidebar_dropdown > div div.dropdown_btn').click(function() {
        $(this).siblings("div.dropdown_menu_options").slideToggle();
    });
    // End of search page

    $('.ass_sett i').click(function() {
        $(this).siblings('div.assess_dropdown').fadeToggle();
    });

    // progress bar
    $(".progress").each(function() {

        var value = $(this).attr('data-value');
        var left = $(this).find('.progress-left .progress-bar');
        var right = $(this).find('.progress-right .progress-bar');

        if (value > 0) {
            if (value <= 50) {
                right.css('transform', 'rotate(' + percentageToDegrees(value) + 'deg)')
            } else {
                right.css('transform', 'rotate(180deg)')
                left.css('transform', 'rotate(' + percentageToDegrees(value - 50) + 'deg)')
            }
        }

    })

    function percentageToDegrees(percentage) {
        return percentage / 100 * 360
    }
    // End of progress bar

    // Job Alert options slider

    var options_width = 250 * $(".options_slider > div").length;
    $(".options_slider").css("width", options_width + "px");

    // End of Job Alert options slider

    // FAQ
    $(".each_question_n_answer .header").click(function() {
            $(this).find('i').toggleClass('rotate_arrow');
            $(this).parent().siblings().find('.answer').not(this).slideUp(300);
            $(this).parent().siblings().find('i').removeClass('rotate_arrow');
            $(this).siblings(".answer").slideToggle(300);
        })
        // End FAQ
        //  Mobile Nav toggle
    $('.menu_button').click(function() {
            $('.mobile_nav').toggleClass('mobile_nav_display');
            $('.menu_button').toggleClass('cross_icon');
        })
        //  End Mobile Nav toggle

    // Dashboard sideNav Toggler
    $('.dashboard_menu_toggler').click(function() {

        $('.side_nav').css({
            'width': '250px',
            'transform': 'translateX(0)'
        })

        $('.close_nav_container').css({
            "display": "flex",
            'flex-direction': 'row',
            'justify-content': 'flex-end'
        })

    })

    $('.dash_close_nav').click(function() {

            $('.side_nav').css({
                'transform': 'translateX(-100%)'
            })

            $('.close_nav_container').css({
                "display": "none"
            })

        })
        // End Dashboard sideNav Toggler

    $('#goto_next_two').click(function(e) {
        e.preventDefault();

        $('.profile_reg_progress > div.step_two_link').addClass("active");

        $("[class*='profile_form_header']").not(".step_two_header").fadeOut(300);
        $(".step_two_header").delay(300).fadeIn();

        $("[id*='form_step_']").not("#form_step_two").fadeOut(300);
        $("#form_step_two").delay(300).fadeIn();
    })

    $('.register_section_link > #approved_jobs_link').click(function() {

        $(".register_section_link div").not(this).removeClass("active");
        $(this).addClass("active");

        $("#pending_jobs_page").not("#approved_jobs_page").fadeOut(300);
        $("#approved_jobs_page").delay(300).fadeIn();
    })

    $('.register_section_link > #pending_jobs_link').click(function() {

        $(".register_section_link div").not(this).removeClass("active");
        $(this).addClass("active");

        $("#approved_jobs_page").not("#pending_jobs_page").fadeOut(300);
        $("#pending_jobs_page").delay(300).fadeIn();
    })

    //Cookie notice
    window.cookieconsent.initialise({
        "palette": {
            "popup": {
                "background": "#06942a",
                "text": "#f3f3f3"
            },
            "button": {
                "background": "#f1d600"
            }
        },
        "theme": "classic",
        "content": {
            "message": "We use cookies to enhance your activities and preferences to make your experience on our website more efficient. By browsing our website, you consent to our use of cookies in accordance with our Cookie Policy.",
            "dismiss": "Accept",
            "deny": "Dismiss",
            "link": "Learn more",
            "href": "https://www.getajobng.com/cookie-policy"
        }
    });

    // Navigator
    const navs = document.querySelectorAll('[class*="nav--"]');
    const tabs = document.querySelectorAll('[class*="tab--"]');
    navs.forEach((nav, index) => {
        nav.addEventListener("click", function() {
            const allNav = document.querySelector(".navigator").childNodes;
            allNav.forEach((eachNav) => {
                if (eachNav.classList) {
                    eachNav.classList.remove("active");
                }
            });
            this.classList.add("active");
            const navIndex = index;
            tabs.forEach((tab, index) => {
                if (navIndex === index) {
                    const allTab = document.querySelector(".tabs").childNodes;
                    allTab.forEach((eachTab) => {
                        if (eachTab.classList) {
                            eachTab.classList.remove("active");
                        }
                    });

                    const tabClasses = ["active", "moveInFromBotton"];
                    tab.classList.add(...tabClasses);
                    console.log(tab);
                }
            });
        });
        // const tabs = document.querySelectorAll('[class*="tab--"]');
    });


});

var w = window.innerWidth;
var h = window.innerHeight;

function trimString(value) {
    return value.trim();
}