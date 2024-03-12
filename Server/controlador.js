const mongo = require('./mongo.js');

// Create a new MongoClient
const client = new MongoClient(mongo.url);
// Connect to the Atlas cluster
client.connect();

async function getElement(collection, key, value) {
    try {
        const document = mongo.getDocument(collection, key, value);
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}