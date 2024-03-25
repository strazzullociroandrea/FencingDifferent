const fs = require("fs");
const mysql = require("mysql2/promise");
/**
 * Modulo contenente la funzione per recuperare gli atleti da db
 * @param {*} nomeTorneo
 * @param {*} data
 * @returns
 */
const recuperaAtleti = async (user) => {
  try {
    const conf = JSON.parse(fs.readFileSync("conf.json"));
    const connection = await mysql.createConnection(conf);

    const [rows, fields] = await connection.execute(
      "SELECT * FROM partecipare JOIN atleta ON atleta.codiceFis = partecipare.codiceFisAtleta WHERE partecipare.idFase='iniziale' AND emailUtente ='" +
        user +
        "'"
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

module.exports = recuperaAtleti;
