var config = require('../config/config');
var helper = require('../config/helpers');

class Payment {

    savePaymentTransaction(transaction_code, user_id, payment_plan_id, amount, status, ipAddress, channel) {
        transaction_code = helper.checkifUndefined(transaction_code);
        payment_plan_id = helper.checkifUndefined(payment_plan_id);
        amount = helper.checkifUndefined(amount);
        status = helper.checkifUndefined(status);
        ipAddress = helper.checkifUndefined(ipAddress);
        channel = helper.checkifUndefined(channel);

        var date_created = helper.getCurrentTimeStamp();

        var sql = `INSERT INTO transactions(transaction_code, user_id, payment_plan_id, amount, status, \
            date_created, ip_address, channel) VALUES ('${transaction_code}', ${user_id}, ${payment_plan_id}, '${amount}', \
            '${status}', '${date_created}', '${ipAddress}', '${channel}')`;

        return sql;
    }

    getTransactionDetails(transaction_code, user_id) {
        transaction_code = helper.checkifUndefined(transaction_code);

        var sql = `SELECT t.*, p.* FROM transactions t INNER JOIN payment_plan p ON p.plan_id = t.payment_plan_id \
                WHERE t.transaction_code = '${transaction_code}' AND t.user_id = ${user_id}`;

        return sql;
    }

    getPaymentPlanDetails(payment_plan_id) {
        payment_plan_id = helper.checkifUndefined(payment_plan_id);

        var sql = `SELECT * FROM payment_plan WHERE plan_id = ${payment_plan_id}`;

        return sql;
    }

}

module.exports = Payment;