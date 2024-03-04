const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

//servizi 
const recuperaTornei = require("./services/recuperaTornei");
const recuperaAtleti = require("./services/recuperaAtleti");
const recuperaGironi = require("./services/recuperaGironi");
const recuperaClassificaGironi = require("./services/recuperaClassificaGironi");

(async () => {

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
        }),
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
            recuperaTornei().then(result=>{
                response.json({ response: result.reverse() });
            });
        } catch (error) {
            response.status(500).json({ error: error.message });
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
    })

    /**
     * Funzione per recuperare l'eliminazione diretta di un torneo
     */
    app.post("/scherma/eliminazineDiretta", async (request, response) => {
        const { nomeTorneo, data } = request.body;
        try {
            const result = await recuperaClassificaGironi(nomeTorneo, data);
            response.json({ response: result });
        } catch (error) {
            response.status(500).json({ error: error.message });
        }
    });

    /**
     * Creazione del server ed ascolto sulla porta effimera 3040
     */
    const server = http.createServer(app);
    server.listen(3040, () => {
        console.log("---> server running");
    });
})();