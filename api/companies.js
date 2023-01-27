var express = require('express');
var db = require('../db/database');
var Company = require('../models/company');
var uuidv4 = require('uuid/v4');
var helpers = require('../config/helpers');
var logger = require('../config/log4js');

const router = express.Router();

router.get("/", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        db.query(Company.getAllCompaniesQuery(), (err, data) => {
            if (!err) {
                res.status(200).json({
                    message: "Companies listed.",
                    companyId: data
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
        var company = new Company(uuidv4(), req.body.company_name, req.body.rc_number);

        db.query(company.createCompanyQuery(), (err, data) => {
            res.status(200).json({
                message: "Company added.",
                companyId: data.insertId
            });
        });
    } catch (error) {
        logger.log(error);
    }
});

router.get("/:companyId", (req, res, next) => {
    try {
        helpers.checkifAuthenticated(req, res);

        var companyId = req.params.companyId;

        db.query(Company.getCompanyByIdQuery(companyId), (err, data) => {
            if (!err) {
                if (data && data.length > 0) {
                    res.status(200).json({
                        message: "Company found.",
                        product: data
                    });
                } else {
                    res.status(200).json({
                        message: "Company Not found."
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

        var companyId = req.body.companyId;

        db.query(Company.deleteCompanyByIdQuery(companyId), (err, data) => {
            if (!err) {
                if (data && data.affectedRows > 0) {
                    res.status(200).json({
                        message: `Company deleted with id = ${companyId}.`,
                        affectedRows: data.affectedRows
                    });
                } else {
                    res.status(200).json({
                        message: "Company Not found."
                    });
                }
            }
        });
    } catch (error) {
        logger.log(error);
    }
});

module.exports = router;