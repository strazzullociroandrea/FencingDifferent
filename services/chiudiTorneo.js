const fs = require("fs");
const mysql = require("mysql2/promise");

const chiudiTorneo = async (nome, data) => {
    try {
        const conf = JSON.parse(fs.readFileSync("conf.json"));
        const connection = await mysql.createConnection(conf);
        const sql = `
            UPDATE torneo SET svolto = 0 WHERE nome = ? AND data = ?
        `;
        const [rows, fields] = await connection.execute(sql, [nome, data]);
        await connection.end();
        return { result: "ok" };
    } catch (error) {
        return { result: "error" };
    }
}

module.exports = chiudiTorneo;
