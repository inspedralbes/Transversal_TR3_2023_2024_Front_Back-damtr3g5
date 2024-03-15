module.exports = { getElement, updateElement, insertElement, getCollection, deleteElement};
const { MongoClient } = require("mongodb");
require('dotenv').config();

// Replace the following with your Atlas connection string
const url = `mongodb://${process.env.USER}:${process.env.PWD}@ac-qmatjct-shard-00-00.qxnrafx.mongodb.net:27017,ac-qmatjct-shard-00-01.qxnrafx.mongodb.net:27017,ac-qmatjct-shard-00-02.qxnrafx.mongodb.net:27017/?replicaSet=atlas-w5hecx-shard-0&ssl=true&authSource=admin`
// Database Name
const dbName = 'juegoMongo';

// Options for the MongoClient
const options = { 
    minPoolSize: 2, 
    maxPoolSize: 10 
};

// Crear una instancia de MongoClient con las opciones
const client = new MongoClient(url, options);

// Conectar la pool de conexiones
client.connect();

// Funciones para interactuar con la base de datos
async function getElement(collection, key, value) {
    try {
        const db = client.db(dbName);
        const col = db.collection(collection);
        let obj = {}
        obj[key] = value
        const document = await col.findOne(obj);
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}

async function deleteElement(collection,key, value) {
    try {
        const db = client.db(dbName);
        const col = db.collection(collection);
        let obj = {}
        obj[key] = value
        const document = await col.deleteOne(obj);
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}

async function updateElement(collection, key, value, data) {
    try {
        const db = client.db(dbName);
        const col = db.collection(collection);
        let obj = {}
        obj[key] = value
        const document = await col.replaceOne(obj, data);
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}

async function insertElement(data, collection) {
    try {
        const db = client.db(dbName);
        const col = db.collection(collection);
        const res = await col.insertOne(data);
    } catch (err) {
        console.log(err.stack);
    }
}

async function getCollection(collection, filter) {
    try {
        filter = typeof filter !== "undefined" ? filter : {};
        const db = client.db(dbName);
        const col = db.collection(collection);
        const document = await col.find(filter).toArray();
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}

async function eliminar(collection, key,values) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const miColeccion = db.collection(collection);
        let obj = {}
        obj[key] = values
        miColeccion.deleteMany(obj)
            .then((result) => {
                console.log(`${result.deletedCount} documentos eliminados`);
            })
            .catch((error) => {
                console.error('Error al eliminar documentos:', error);
            });
        return question;
    } catch (err) {
        console.log(err.stack)
    }
}