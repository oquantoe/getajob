var express = require('express');
var db = require('../db/database');
var User = require('../models/user');
var uuidv1 = require('uuid/v1');
var helpers = require('../config/helpers');
var config = require('./../config/config');
var logger = require('./../config/log4js');

const router = express.Router();

router.get("/", (req, res, next) => {
    try {
        //helpers.checkifAuthenticated(req, res);

        db.query(User.getAllUsersQuery(), (err, data) => {
            if (!err) {
                res.status(200).json({
                    message: "Users listed.",
                    users: data
                });
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post("/add", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        //read user information from request
        var user = new User(uuidv1(), req.body.first_name, req.body.last_name, req.body.email, req.body.password);

        db.query(user.createUserQuery(), (err, data) => {
            res.status(200).json({
                message: "User added.",
                userId: data.insertId
            });
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get("/:userId", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var userId = req.params.userId;

        db.query(User.getUserByIdQuery(userId), (err, data) => {
            if (!err) {
                if (data && data.length > 0) {

                    res.status(200).json({
                        message: "User found.",
                        user: data
                    });
                } else {
                    res.status(200).json({
                        message: "User Not found."
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

router.post("/delete", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var userId = req.body.userId;

        db.query(User.deleteUserByIdQuery(userId), (err, data) => {
            if (!err) {
                if (data && data.affectedRows > 0) {
                    res.status(200).json({
                        message: `User deleted with id = ${userId}.`,
                        affectedRows: data.affectedRows
                    });
                } else {
                    res.status(200).json({
                        message: "User Not found."
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

module.exports = router;