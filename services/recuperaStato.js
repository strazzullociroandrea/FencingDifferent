
const fs = require("fs");
const mysql = require("mysql2/promise");
/**
 * Modulo contenente la funzione per recuperare i gironi dal db
 * @param {*} nomeTorneo 
 * @param {*} data 
 * @returns 
 */
const recuperaStato = async (nomeTorneo, data) => {
    try {
        const conf = JSON.parse(fs.readFileSync("conf.json"));
        const connection = await mysql.createConnection(conf);
        const sql = "SELECT svolto FROM torneo WHERE data = '" + data + "' AND nome = '" + nomeTorneo + "'";
        const [rows, fields] = await connection.execute(sql);
        await connection.end();
        if (rows.length > 0) {
            console.log(rows);
            return rows;
        } else {
            return [];
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = recuperaStato;