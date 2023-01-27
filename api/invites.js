var express = require('express');
var db = require('../db/database');
var User = require('../models/user');
var logger = require('./../config/log4js');

const router = express.Router();

router.get("/:inviteToken", (req, res, next) => {
    try {
        var inviteToken = req.params.inviteToken;

        db.query(User.getUserByInviteToken(inviteToken), (err, data) => {
            if (!err) {
                if (data && data.length > 0) {
                    logger.log("User id Invited - " + data[0].user_id);
                    var user_id = data[0].user_id;

                    var user = new User();
                    db.query(user.deactivateInviteToken(data[0].user_id), (err, data) => {
                        if (err) { logger.log(err) } else {
                            logger.log("User Invite Token is deactivated");

                            // Redirect to create password page
                            res.redirect('/recruiters/create-password?userId=' + user_id);
                        }
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