var mysql = require('mysql');
var config = require('../config/config');
var logger = require('./../config/log4js');

const pool = mysql.createPool({
    connectionLimit: 100,
    connectTimeout: 60 * 1000,
    acquireTimeout: 60 * 1000,
    timeout: 60 * 1000,
    host: config.local_db_host,
    user: config.local_db_username,
    password: config.local_db_password,
    database: config.local_database,
    debug: false
});

function executeQuery(sql, callback) {
    try {
        pool.getConnection((err, connection) => {
            if (err) {
                return callback(err, null);
            } else {
                if (connection) {
                    connection.query(sql, function(error, results, fields) {
                        connection.release();
                        if (error) {
                            return callback(error, null);
                        }
                        return callback(null, results);
                    });
                }
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

function executeQuery2(sql, parameters, callback) {
    try {
        pool.getConnection((err, connection) => {
            if (err) {
                return callback(err, null);
            } else {
                if (connection) {
                    connection.query(sql, parameters, function(error, results, fields) {
                        connection.release();
                        if (error) {
                            return callback(error, null);
                        }
                        return callback(null, results);
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }
}

function query2(sql, parameters, callback) {
    try {
        executeQuery2(sql, parameters, function(err, data) {
            logger.log("SQL: " + sql);
            logger.log("PARAMETERS: " + parameters);

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