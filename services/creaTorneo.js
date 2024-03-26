const fs = require("fs");
const mysql = require("mysql2/promise");

const creaTorneo = async (data, nome, provincia, luogo, pel, ngir) => {
    try {
        const conf = JSON.parse(fs.readFileSync("conf.json"));
        const connection = await mysql.createConnection(conf);
        const sql = `
            INSERT INTO torneo(data,nome,provincia,luogo,percentualeEliminazione,svolto,nGironi) VALUES(?,?,?,?,?,0,?)
        `;
        const [rows, fields] = await connection.execute(sql,[data, nome, provincia, luogo, pel, ngir]);
        await connection.end();
        return {result: "ok"};
    } catch (error) {
        return {result: "error"};
    }
}

module.exports = creaTorneo;