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
const { getEnabledCategories } = require('trace_events');

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
    const skin = {
        name: req.body.name,
        price: req.body.price,
    }
    console.log(skin);
    const subida = await utils.uploadFile(archivo, carpeta);
    if (subida.hasOwnProperty("name")) {

        controladora.addSkin(subida.name, skin, idPersonaje).then((response) => {
            res.status(200).json(utils.respuesta(subida));
        }).catch((err) => {
            res.status(400).json(utils.respuesta(err));
        });
    } else {
        res.status(400).json(utils.respuesta(subida));
    }
});
app.post('/updateskin', upload.single('file'), async (req, res) => {
    const skin = {
        id: req.body.id,
        name: req.body.name,
        price: req.body.price,
    };

    try {
        if (skin.name) {
            await controladora.changeSkinParameters(skin.id, 'name', skin.name);
            if (skin.price) {
                await controladora.changeSkinParameters(skin.id, 'price', skin.price);
            }
            if (req.file) {
                const archivo = req.file;
                const carpeta = req.body.folder;
                const response = await controladora.getSkin(skin.id);
                const originalname = response[0].path.split('/')[1];
                archivo.originalname = originalname;
                const subida = await utils.uploadFile(archivo, carpeta);
                if (subida.hasOwnProperty("name")) {
                    res.status(200).json(utils.respuesta(subida));
                } else {
                    res.status(400).json(utils.respuesta(subida));
                }
            } else {
                res.status(200).json({ message: 'Skin actualizada correctamente.' });
            }
        }
    } catch (err) {
        res.status(400).json(utils.respuesta(err));
    }
});
app.post('/deleteskin', async (req, res) => {
    const id = req.body.id;
    const folder = req.body.folder;
    const response = await controladora.getSkin(id);
    const fileName = response[0].path.split('/')[1];
    const filePath = path.join(__dirname, 'skins', folder, fileName);
    fs.unlink(filePath, async (err) => {
        if (err) {
            res.status(400).json(utils.respuesta(err));
        } else {
            await controladora.deleteSkin(id);
            res.status(200).json({ message: 'Skin eliminada correctamente.' });
        }
    });
});
/*--Gestion de imagenes--*/

app.get("/getData", async (req, res) => {
    const collection = req.query.collection;
    const name = req.query.name;
    let data = []
    if (name && collection) {
        data = await controladora.objectData(collection, name);
    } else {
        data = await controladora.objectData();
    }
    res.json(data);
});
app.post("/changeParam",(req,res)=>{
    const collection = req.query.collection
    const newValue = req.body
    console.log(newValue, collection);
    const id = req.body.id
    if(collection === "Character"){
        controladora.changeCharacterParameters(id, newValue);
    }else if(collection === "Weapons"){
        controladora.changeWeaponParameters(id, newValue);
    }
    res.json({'collection':collection,'nuevo':newValue});
})
app.get("/gameparams", async (req, res) => {
    const data = await controladora.getGameParams();
    console.log(data);
    res.json(data);
})

app.get("/updategameparams", async (req, res) => {
    const paramas = req.body;
    const data = await controladora.updateGameParams(paramas);
    res.json(data);
})