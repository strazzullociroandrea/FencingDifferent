const fs = require("fs");
const mysql = require("mysql2/promise");

const accessLogin = async () => {
    try {
        const conf = JSON.parse(fs.readFileSync("conf.json"));
        const connection = await mysql.createConnection(conf);

        const [rows, fields] = await connection.execute("SELECT utenteRegistrato.Email AS Email, utenteRegistrato.Password AS Password FROM utenteRegistrato");
        await connection.end();
        if (rows.length > 0) {
            return rows;
        } else {
            return [];
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = accessLogin;