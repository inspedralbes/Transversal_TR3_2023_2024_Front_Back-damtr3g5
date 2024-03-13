const express = require('express');
const http = require('http')
const bodyParser = require('body-parser');
const cors = require("cors");
const fs = require('fs');
require('dotenv').config();
const path = require('path');
const multer = require('multer');
//const controladora = require('./controladora.js');
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


app.listen(port, () => {
    console.log(`Server listening at ${SERVER_URL}:${port}`);
});

//--Gestion de imagenes--
app.get("/imagen/:name/:nombreArchivo", (req, res) => {
    const fileName = req.params.nombreArchivo;
    const folder = req.params.name;
    const filePath = path.join(__dirname, 'skins', folder, fileName);

    res.sendFile(filePath);
});

const upload = multer({ dest: 'skins/' });
app.post('/descargar', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Por favor, selecciona una imagen.' });
    }
    const folder = req.body.folder
    const uploadedFile = req.file;
    // Hacer lo que necesites con el archivo cargado, como moverlo a un directorio específico.
    const fileName = uploadedFile.originalname; // Añade la extensión original
    // Ruta de destino para guardar el archivo
    const uploadPath = path.join(__dirname, 'skins', folder, fileName);
    // Mover el archivo a la ubicación deseada
    fs.rename(uploadedFile.path, uploadPath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al subir el archivo.' });
        }
        res.json({ imagen: uploadPath });
    });
});