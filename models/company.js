class Company {

    constructor(company_uuid, company_name, rc_number) {
        this.company_uuid = company_uuid;
        this.company_name = company_name;
        this.rc_number = rc_number;
    }

    createCompanyQuery() {
        var sql = `INSERT INTO company(company_uuid, company_name, rc_number, phone_number, website, industry_id, \
            no_of_employees, year_established, type_of_employer, address, state_id, country_id, billing_address, billing_country, \
            billing_state, is_sole_proprietor, is_recruiting_agency, created_by, facebook_link, twitter_link, linkedin_link, \
            instagram_link, google_plus_link, youtube_channel_link, company_logo, company_banner_img_url, date_created \
            ) VALUES ('${this.company_uuid}','${this.company_name}','${this.rc_number}','','','','','','','','','','','', \
            '','','','','','','','','','','','','','')`;

        return sql;
    }

    static getCompanyByIdQuery(company_id) {
        var sql = `SELECT * FROM company WHERE company_id = ${company_id}`;
        return sql;
    }

    static deleteCompanyByIdQuery(company_id) {
        var sql = `DELETE FROM company WHERE company_id = ${company_id}`;
        return sql;
    }

    static getAllCompaniesQuery() {
        var sql = `SELECT * FROM company`;
        return sql;
    }

    static getUserCompany(user_id) {
        var sql = `SELECT * FROM company WHERE created_by = ${user_id}`;

        return sql;
    }

    static getUserCompanyById(company_id) {
        var sql = `SELECT * FROM company WHERE company_id = ${company_id}`;

        return sql;
    }
}

module.exports = Company;