var config = require('../config/config');
var helper = require('../config/helpers');

class Admin {
    constructor() {}

    getAllCVFixPricesQuery() {
        var sql = `SELECT * FROM payment_plan WHERE payment_plan_type = 1`;

        return sql;
    }

    getAllRecruiterSubscriptionPricesQuery() {
        var sql = `SELECT * FROM payment_plan WHERE payment_plan_type = 2`;

        return sql;
    }

    updatePaymentPlan(amount, is_free, plan_id) {
        var sql = `UPDATE payment_plan SET amount = '${amount}', is_free = ${is_free} WHERE plan_id = ${plan_id}`;

        return sql;
    }

    getRecruiterInfo(user_id) {
        var sql = `SELECT u.*, c.* FROM user u INNER JOIN company c ON c.created_by = u.user_id WHERE user_id = ${user_id}`;

        return sql;
    }

    getRecruiterCertificateOfIncorp(user_id) {
        var sql = `SELECT certificate_of_incorp_url FROM user u INNER JOIN company c ON c.created_by = u.user_id WHERE user_id = ${user_id}`;

        return sql;
    }

    getRecruiterMeansOfID(user_id) {
        var sql = `SELECT means_of_id_url FROM user WHERE user_id = ${user_id}`;

        return sql;
    }

    setRecruiterApprovalStatus(approval_status, recruiter_id) {
        var date_created = helper.getCurrentTimeStamp();

        var sql = `UPDATE user SET is_approved = ${approval_status}, approval_date = '${date_created}' \
                    WHERE user_id = ${recruiter_id}`;

        return sql;
    }

    setAdminJobApprovalStatus(job_id) {
        var date_created = helper.getCurrentTimeStamp();
        var status = config.active;

        var sql = `UPDATE job SET is_approved = ${config.true}, status = '${status}', \
                    approval_date = '${date_created}' WHERE job_id = ${job_id}`;

        return sql;
    }

    setAdminJobDisapprovalStatus(job_id) {
        var date_created = helper.getCurrentTimeStamp();
        var status = config.pending;

        var sql = `UPDATE job SET is_approved = ${config.false}, status = '${status}' \
                    approval_date = '${date_created}' WHERE job_id = ${job_id}`;

        return sql;
    }
}

module.exports = Admin;