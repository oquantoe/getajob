var helpers = require('./helpers');
var config = require('./config');
var logger = require('./log4js');

var LocalStorage = require('node-localstorage').LocalStorage;
var localStorage = new LocalStorage('./scratch');

var localStore = {

    saveUsersRecommendedJobsByQualification: function(jobs) {
        localStorage.setItem(config.tag_job_recommendation_by_qualification, jobs)


        logger.log("Recommended Jobs By Qualification Saved!");


        // var allJobs = this.getUsersRecommendedJobs(); 

        /* if(allJobs.length == 0){
             logger.log("allJobs is 0")
             localStorage.setItem('recommendedJobs', jobs);
         } else{
             logger.log("allJobs IS NOT 0")
             localStorage.setItem('recommendedJobs', (allJobs +jobs));
         } */
    },

    getUsersRecommendedJobsByQualification: function() {

        var allJobs = localStorage.getItem(config.tag_job_recommendation_by_qualification);

        logger.log("allJobs - " + allJobs);

        //var allJobsArray = helpers.parseJSONToArray(allJobs);


        //logger.log("allJobs - " + allJobs.length)
        //logger.log(allJobsArray)

        return allJobs;
    },

    saveUsersRecommendedJobsByGender: function(jobs) {
        localStorage.setItem(config.tag_job_recommendation_by_gender, jobs)

        logger.log("Recommended Jobs By Gender Saved!");
    },


    clearLocalStore: function() {
        if (typeof localStorage === "undefined" || localStorage === null) {
            var LocalStorage = require('node-localstorage').LocalStorage;
            var localStorage = new LocalStorage('./scratch');
        }

        localStorage.clear();
    }


}


module.exports = localStore;