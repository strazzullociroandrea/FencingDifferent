const fs = require("fs");
const mysql = require("mysql2/promise");

const aggiornaAssalti = async (torneo, data, fisUno, fisDue, punt, tipologia) => {
    try {
        const conf = JSON.parse(fs.readFileSync("conf.json"));
        const connection = await mysql.createConnection(conf);
        
        // Recupero l'id della fase
        const sqlRecuperoIdFase = `
            SELECT idFase 
            FROM fase 
            WHERE nomeTorneo = ? AND dataTorneo = ? AND tipologia = ?;
        `;
        const [idFaseRows] = await connection.execute(sqlRecuperoIdFase, [torneo, data, tipologia]);
        
        if (idFaseRows.length > 0) {
            const idFase = idFaseRows[0].idFase;
            // Controllo se l'assalto è già presente
            const sqlControllo = `
                SELECT * 
                FROM partecipare p1 
                INNER JOIN partecipare p2 
                    ON p1.idAssalto = p2.idAssalto 
                    AND p1.nomeTorneo = p2.nomeTorneo 
                    AND p1.dataTorneo = p2.dataTorneo 
                    AND p1.idFase = p2.idFase
                WHERE ((p1.codiceFisAtleta = ? AND p2.codiceFisAtleta = ?)
                OR (p1.codiceFisAtleta = ? AND p2.codiceFisAtleta = ?))
                AND p1.nomeTorneo = ?
                AND p1.dataTorneo = ?
                AND p1.idFase = ?;
            `;
            const [controlli] = await connection.execute(sqlControllo, [fisUno, fisDue, fisDue, fisUno, torneo, data, idFase]);
            
            if (controlli.length > 0) {
                // Se l'assalto è presente, aggiorna il punteggio
                const sqlAggiornamento = `
                    UPDATE partecipare 
                    SET punteggio = ? 
                    WHERE codiceFisAtleta = ? 
                    AND nomeTorneo = ? 
                    AND dataTorneo = ? 
                    AND idFase = ? 
                    AND idAssalto IN (
                        SELECT assalto.id 
                        FROM assalto 
                        INNER JOIN partecipare 
                        ON assalto.id = partecipare.idAssalto 
                        WHERE assalto.idFase = ? 
                        AND assalto.nomeTorneo = ? 
                        AND assalto.dataTorneo = ? 
                        AND partecipare.codiceFisAtleta = ?
                    )
                `;
                const [aggiornamento] = await connection.execute(sqlAggiornamento, [punt, fisUno, torneo, data, idFase, idFase, torneo, data, fisUno]);
                await connection.close();
                return { result: "Punteggio aggiornato con successo" };
            } else {
                await connection.close();
                return { result: "Nessun assegnamento fatto con i codici fiscali forniti" };
            }
        } else {
            await connection.close();
            return { result: "Fase non esistente nel database" };
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = aggiornaAssalti;
