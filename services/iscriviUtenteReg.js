const fs = require("fs");
const mysql = require("mysql2/promise");

const iscriviUtenteReg = async (nomeTorneo, data, user) => {
  try {
    const conf = JSON.parse(fs.readFileSync("conf.json"));
    const connection = await mysql.createConnection(conf);

    const [rows, fields] = await connection.execute(
      "SELECT * FROM atleta WHERE atleta.emailUtente = '" + user + "'"
    );
    const [rows2, fields2] = await connection.execute(
      "INSERT INTO partecipare VALUES (" +
        rows[0].codiceFis +
        ", '" +
        nomeTorneo +
        "', '" +
        data +
        "', '','iniziale', '')"
    );
    await connection.end();
    if (rows.length > 0) {
      return rows;
    } else {
      return [];
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = iscriviUtenteReg;
