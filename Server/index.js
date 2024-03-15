const express = require('express');
const http = require('http')
const bodyParser = require('body-parser');
const cors = require("cors");
const fs = require('fs');
require('dotenv').config();
const path = require('path');
const multer = require('multer');
const controladora = require('./controladora.js');
const utils = require('./utils.js');
const corsOptions = {
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ['GET', 'POST', 'DELETE'],
    exposedHeaders: ['set-cookie', 'ajax-redirect'],
    preflightContinue: true,
    optionsSuccessStatus: 200,
};

const app = express();
const port = 8080
const SERVER_URL = "localhost";
const sessionMiddleware = require('./sessionMiddleware.js');


app.use(cors(corsOptions)); 
app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(express.json())
app.use(express.static('images'))
const server = http.createServer(app);
const { initializeSocket} = require("./sockets.js");

initializeSocket(server,{ cors: corsOptions });


server.listen(port, () => {
    console.log(`Server listening at ${SERVER_URL}:${port}`);
});

/*--Gestion de imagenes--*/
app.get("/imagen/:name/:nombreArchivo", (req, res) => {
    const fileName = req.params.nombreArchivo;
    const folder = req.params.name;
    const filePath = path.join(__dirname, 'skins', folder, fileName);
    res.sendFile(filePath);
});

const upload = multer({ dest: 'skins/' });
app.post('/addskin', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Por favor, selecciona una imagen.' });
    }
    const archivo = req.file;
    const carpeta = req.body.folder;
    const idPersonaje = req.body.id;
    const subida = await utils.uploadFile(archivo, carpeta);
    res.json(utils.respuesta(subida));
    if(subida)
        controladora.addCharacterSkin(idPersonaje, subida.name);
});
/*--Gestion de imagenes--*/

app.get("/getsprites", (req, res) => {
    const filePath = path.join(__dirname, 'skins');
    const imageNames = utils.getImageNames(filePath);
    res.send(imageNames);
});