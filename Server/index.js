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
const port = process.env.PORT
const SERVER_URL = process.env.SERVER
const sessionMiddleware = require('./sessionMiddleware.js');

app.use(cors(corsOptions));
app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(express.json())
app.use(express.static('images'))


app.listen(port, () => {
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
    const skinName = req.body.name;
    const subida = await utils.uploadFile(archivo, carpeta);
    res.json(utils.respuesta(subida));
    if(subida.hasOwnProperty("name"))
        controladora.addSkin(subida.name, skinName, idPersonaje);
});
/*--Gestion de imagenes--*/

app.get("/getsprites", (req, res) => {
    const filePath = path.join(__dirname, 'skins');
    const imageNames = utils.getImageNames(filePath);
    res.send(imageNames);
});
app.post("/changeParams",(req,res)=>{
    const collection = req.body.collection
    const param = req.body.param
    const newValue = req.body.newValue
    const id = req.body.id
    controladora.changeValueGeneric(id,collection,param,newValue);
    res.json({'collection':collection,'parameter':param,'value':newValue});
})

