const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const conf = JSON.parse(fs.readFileSync("conf.json"));
//servizi
const recuperaTornei = require("./services/recuperaTornei");
const recuperaAtleti = require("./services/recuperaAtleti");
const recuperaGironi = require("./services/recuperaGironi");
const recuperaClassificaGironi = require("./services/recuperaClassificaGironi");
const eliminazineDiretta = require("./services/eliminazioneDiretta.js");
const accessLogin = require("./services/accessLogin.js");
const iscriviUtenteReg = require("./services/iscriviUtenteReg.js");
const recuperaStorico = require("./services/recuperaStorico.js");
const assalti = require("./services/assalti.js");
const aggiornaAssalti = require("./services/aggiornaAssalti.js");
const creaTorneo  = require("./services/creaTorneo.js");
const eliminaTorneo = require("./services/eliminaTorneo.js");
const recuperaFasi = require("./services/recuperaFasi.js");
const recuperaStato = require("./services/recuperaStato.js");

(() => {
  //gestione cors
  const corsOptions = {
    origin: "*",
    methods: "POST",
    optionsSuccessStatus: 204,
  };
  app.use(cors(corsOptions));

  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  //reindirizzamento a cartella public con la form di login
  app.use("/scherma", express.static(path.join(__dirname, "public")));

  /**
   * Funzione per recuperare gli atleti di un torneo
   */
  app.post("/scherma/atleti", async (request, response) => {
    const { nomeTorneo, data } = request.body;
    try {
      const result = await recuperaAtleti(nomeTorneo, data);
      response.json({ response: result });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  });
  /**
   * Funzione per recuperare i tornei salvati sul server
   */
  app.get("/scherma/tornei", async (request, response) => {
    try {
      recuperaTornei().then((result) => {
        response.json({ response: result.reverse() });
      });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  });
  /**
     * Funzione per eliminare un torneo
     */
  app.post("/scherma/eliminaTorneo", async (request, response) => {
    const { nome, data } = request.body;
    if(nome && data && nome !== "" && data !== ""){
      try {
        const result = await eliminaTorneo(nome, data);
        response.json(result);
      } catch (error) {
        response.status(500).json({ result: error.message });
      }
    }else{
      response.status(400).json({ result: "Dati non validi" });
    }
   
  });
  /**
   * Funzione per recuperare i gironi di un torneo
   */
  app.post("/scherma/gironi", async (request, response) => {
    const { nomeTorneo, data } = request.body;
    try {
      const result = await recuperaGironi(nomeTorneo, data);
      response.json({ response: result });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  });

  app.post("/scherma/selectFasi",async(request,response)=>{
    const { nomeTorneo, data } = request.body;
    try {
      const result = await recuperaFasi(nomeTorneo, data);
      
      response.json({ response: result });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  });
  /**
   * Funzione per recuperare la classifica dei gironi di un torneo
   */
  app.post("/scherma/classificaGironi", async (request, response) => {
    const { nomeTorneo, data } = request.body;
    try {
      const result = await recuperaGironi(nomeTorneo, data);
      response.json({ response: result });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  });
  app.post("/scherma/statoTorneo", async (request, response) => {
    const { nomeTorneo, data } = request.body;
    try {
      const result = await recuperaStato(nomeTorneo, data);
      console.log(result);
      response.json({ response: result });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  });
  
  /**
   * Funzione per recuperare l'eliminazione diretta di un torneo
   */
  app.post("/scherma/eliminazioneDiretta", async (request, response) => {
    const { nomeTorneo, data, tipologia } = request.body;
    try {
      const result = await eliminazineDiretta(nomeTorneo, data, tipologia);
      response.json({ response: result });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  });

  /**
   * Gestione credenziali accesso
   */
  const adminAccess = JSON.parse(fs.readFileSync("./credAdmin.json"));
  app.post("/scherma/accessLogin", (req, res) => {
    const username = req.headers.username;
    const password = req.headers.password;
    if (username == adminAccess.username && password == adminAccess.password) {
      res.json({ result: "admin" });
    } else {
      checkLogin(username, password)
        .then(() => {
          res.json({ result: "utenteReg" });
        })
        .catch(() => {
          res.status(401); //401 è il codice http Unauthorized)
          res.json({ result: "Unauthorized" });
        });
    }
  });

  const checkLogin = (username, password) => {
    return new Promise((res, rej) => {
      accessLogin().then((result) => {
        let check = false;
        result.forEach((utente) => {
          if (utente.Email == username && utente.Password == password) {
            check = true;
          }
        });
        if (check) {
          res();
        } else {
          rej();
        }
      });
    });
  };

  /**
   * Funzione per iscrivere un atleta di un torneo
   */
  app.post("/scherma/iscriviUtenteReg", async (request, response) => {
    const user = request.headers.username;
    const pass = request.headers.password;
    const { nomeTorneo, data } = request.body;
    try {
      const result = await iscriviUtenteReg(nomeTorneo, data, user);
      response.json({ response: "iscritto" });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  });

  /**
   * Funzione per recupero storico
   */
  app.post("/scherma/recuperaStorico", async (request, response) => {
    const { user } = request.body;
    try {
      const result = await recuperaStorico(user);
      response.json({ response: result });
    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  });
  /**
   * Servizio per fare l'aggiornamento di un assalto, modifica il punteggio della riga assegnata all'atleta con codice fis uno
   */
  app.post("/scherma/aggiornaAssalti",async (request, response)=>{
    const {torneo, data, fisUno, fisDue, punteggio, tipologia} = request.body;
    if(torneo && data && fisUno && fisDue && punteggio  && tipologia && torneo !== "" && data !== ""  && fisUno !== ""  && fisDue !== ""  && punteggio !== ""  && tipologia !== "" ){
      const response = await aggiornaAssalti(torneo, data, fisUno, fisDue, punteggio, tipologia);
      response.json(response);
    }else{
      response.status(400).json({ result: "Elementi non completi o non validi" });
    }
  });
  /**
   * Servizio per registrare assalti in comune
   */
  app.post("/scherma/assegnaAssalti", async(request, response)=>{
    const {torneo, data, fisUno, fisDue, punteggioUno, punteggioDue, tipologia} = request.body;
    if(torneo && data && fisUno && fisDue && punteggioUno && punteggioDue && tipologia && torneo !== "" && data !== ""  && fisUno !== ""  && fisDue !== ""  && punteggioUno !== ""  && punteggioDue !== "" && tipologia !== "" ){
      const res = await assalti(torneo, data, fisUno, fisDue, punteggioUno, punteggioDue, tipologia);
      response.json(res);
    }else{
      response.status(400).json({ result: "Elementi non completi o non validi" });
    }
  });
  /**
   * Servizio per salvare in db il torneo
   */
  app.post("/scherma/creaTorneo",async(request, response)=>{
      const {data, nome, provincia, luogo, pel, ngir} = request.body;
      if(data && nome && provincia && luogo && pel && ngir && data !== "" && nome !== "" && provincia !== "" && luogo !== "" && pel !== "" && ngir !== ""){
        const res = await creaTorneo(data, nome, provincia, luogo, pel, ngir);
        response.json(res);
      }else{
      response.status(400).json({ result: "Elementi non completi o non validi" });
      }
  });
  /**
   * Gestione richiesta servizi/pagine non disponibili
   */
  app.use((req, res, next) => {
    res.status(404).send(`
        <!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pagina principale</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            color: #333;
            text-align: center;
            padding: 50px;
            margin: 0;
        }
        a {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h1>Benvenuto nella pagina principale del server casaponissa.ddns.net</h1>
    
    <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    <a href="/scherma">Vai alla pagina di "Fencing Different"</a>
    <br><br><br><br><br><br><br><br><br>
    <a href="/phpmyadmin">Vai alla pagina del DB</a>
</body>
</html>

        `);
  });

  /**
   * Creazione del server ed ascolto sulla porta effimera 3040
   */
  const server = http.createServer(app);
  server.listen(3040, () => {
    console.log("---> server running");
  });
})();
