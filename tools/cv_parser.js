var ResumeParser = require('resume-parser');
var logger = require('./../config/log4js');
var appRoot = require('app-root-path');

var cv_parser = {

    parseCV: function(cv_path) {
        try {
            ResumeParser
                .parseResumeUrl('127.0.0.1:8080/' + cv_path)
                .then(data => {
                    logger.log(data)
                })
                .catch(error => {
                    logger.error(error);
                });
        } catch (error) {
            logger.log(error);
        }
    }
}

module.exports = cv_parser;