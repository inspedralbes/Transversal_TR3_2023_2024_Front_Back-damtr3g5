module.exports = { getElement, updateElement, insertElement, getCollection, deleteElement};
const { MongoClient } = require("mongodb");
require('dotenv').config();

// Replace the following with your Atlas connection string
const url = `mongodb+srv://${process.env.USER}:${process.env.USER}@cluster0.uiii7nf.mongodb.net/`;

// Database Name
const dbName = 'juegoMongo';
const client = new MongoClient(url);
client.connect();

async function getElement(collection, key, value) {
    try {
        await client.connect();
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
        await client.connect();
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
async function updateElement(collection,key, value, data) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection(collection);
        let obj = {}
        obj[key] = value
        const document = await col.updateMany(obj, data);
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}

async function insertElement(data, collection) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection(collection);
        col.insertOne(data, function (err, res) {
            if (err) throw err;
            console.log("1 result inserted")
        })
    } catch (err) {
        console.log(err.stack);
    }
}
async function getCollection(collection, filter) {
    try {
        filter = typeof filter !== "undefined" ? filter : {};
        await client.connect();
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