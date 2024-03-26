const fs = require("fs");
const mysql = require("mysql2/promise");

const chiudiTorneo = async (nome, data, tabella,id,value) => {
    try {
        
        const conf = JSON.parse(fs.readFileSync("conf.json"));
        const connection = await mysql.createConnection(conf);
        console.log("ciao");
        let val = "nome";
        if(tabella === 'fase'){
            val+= "Torneo";
        }
        let sql = `
            UPDATE ${tabella} SET ${value} WHERE ${val} = ? AND data = ?
        `;
        if(id){
            sql += " AND id = '"+id+"'";
        }
        const [rows, fields] = await connection.execute(sql, [nome, data]);
        await connection.end();
        return { result: "ok" };
    } catch (error) {
        console.log(error);
        return { result: "error" };
    }
}

module.exports = chiudiTorneo;
