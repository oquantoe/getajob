var mssql = require('mssql');
var logger = require('./../config/log4js');

// config for your database
var config = {
    user: 'sa',
    password: 'Password@2019',
    server: 'CILAG540GETAJOBNG',
    database: 'getajobng'
};

function executeQuery(sql, callback) {
    try {
        mssql.connect(config, function(err) {
            if (err) {
                logger.log("Error while connecting database :- " + err);
                callback(err, null);
            } else {
                // create Request object
                var request = new mssql.Request();
                // query to the database
                request.query(sql, function(err, results) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, results);
                    }
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }

}

function query(sql, callback) {
    try {
        executeQuery(sql, function(err, data) {
            logger.log("SQL: " + sql);

            if (err) {
                logger.log("ERROR: " + err);
                return callback(err);
            }

            callback(null, data);
        });
    } catch (error) {
        logger.log(error);
    }
}

module.exports = {
    query: query
}