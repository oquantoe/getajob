var log4js = require('log4js');
var appRoot = require('app-root-path');

//Logger Config
log4js.configure({
    appenders: {
        fileAppender: {
            type: 'file',
            filename: `${appRoot}/logs/app_logs.log`,
            maxLogSize: 10485760,
            backups: 3,
            compress: true
        },
        console: {
            type: 'console'
        }
    },
    categories: {
        default: {
            appenders: ['fileAppender', 'console'],
            level: ['all']
        }
    }
});

var logger = {
    log: function(message) {
        var logger = log4js.getLogger();
        logger.level = 'trace';

        return logger.info(message);
    },

    error: function(message) {
        var logger = log4js.getLogger();
        logger.level = 'error';

        return logger.error(message);
    }
}

module.exports = logger;