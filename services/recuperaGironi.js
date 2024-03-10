const fs = require("fs");
const mysql = require("mysql2/promise");
/**
 * Modulo contenente la funzione per recuperare i gironi dal db
 * @param {*} nomeTorneo 
 * @param {*} data 
 * @returns 
 */
const recuperaGironi = async (nomeTorneo, data) => {
    try {
        const conf = JSON.parse(fs.readFileSync("conf.json"));
        const connection = await mysql.createConnection(conf);
        const [rows, fields] = await connection.execute("SELECT nome, cognome, atleta.codiceFis, societa, ranking, punteggio, idAssalto, fase.id AS idFase FROM fase  INNER JOIN partecipare ON id=idFase INNER JOIN atleta ON codiceFisAtleta = codiceFis WHERE fase.dataTorneo = '" + data + "' AND fase.nomeTorneo = '" + nomeTorneo + "' AND fase.svolta=1 AND fase.Tipologia='Girone'");
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

module.exports = recuperaGironi;