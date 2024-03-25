const fs = require("fs");
const mysql = require("mysql2/promise");

const iscriviUtenteReg = async (nomeTorneo, data, user) => {
  try {
    const conf = JSON.parse(fs.readFileSync("conf.json"));
    const connection = await mysql.createConnection(conf);
    const verificaSql =
      "SELECT * FROM partecipare WHERE codiceFisAtleta=(" +
      "SELECT codiceFis FROM atleta WHERE emailUtente='" +
      user +
      "') AND nomeTorneo = '" +
      nomeTorneo +
      "' AND dataTorneo='" +
      data +
      "'";
    const [rows, fields] = await connection.execute(verificaSql);
    if (rows > 0) {
      await connection.end();
      return { response: "Utente già registrato" };
    } else {
      let codiceFis =
        "SELECT codiceFis FROM atleta WHERE emailUtente='" + user + "'";
      const [user, fields] = await connection.execute(verificaSql);
      codiceFis = user[0]["codiceFis"];
      let idPrimoAssalto =
        "SELECT id FROM fase WHERE nomeTorneo='" +
        nomeTorneo +
        "' AND dataTorneo='" +
        data +
        "'";
      const [assalto, fieldss] = await connection.execute(idPrimoAssalto);
      idPrimoAssalto = assalto[0]["id"];

      const sqlAdd =
        "INSERT INTO partecipare(codiceFisAtleta, nomeTorneo, dataTorneo, idAssalto, idFase, punteggio) VALUES('" +
        codiceFis +
        "', '" +
        nomeTorneo +
        "','" +
        data +
        "','-1','" +
        idPrimoAssalto +
        "','-1')";

      const [fne, fs] = await connection.execute(sqlAdd);
      await connection.end();
      return { response: "Utente registrato con successo" };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = iscriviUtenteReg;
