const fs = require("fs");
const mysql = require("mysql2/promise");
/**
 * Modulo contenente la funzione per recuperare gli atleti da db
 * @param {*} nomeTorneo 
 * @param {*} data 
 * @returns 
 */
const eliminazineDiretta = async (nomeTorneo, data, tipologia) => {
    try {
        const conf = JSON.parse(fs.readFileSync("conf.json"));
        const connection = await mysql.createConnection(conf);

        const [rows, fields] = await connection.execute("SELECT cognome, nome, societa, tipologia FROM atleta INNER JOIN partecipare ON codiceFis = partecipare.codiceFisAtleta INNER JOIN fase ON fase.id = partecipare.idFase WHERE fase.nomeTorneo='"+nomeTorneo+"' AND fase.dataTorneo='"+data+"' AND tipologia LIKE 'Eliminazione diretta tab %'");
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

module.exports = eliminazineDiretta;
