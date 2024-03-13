const mongo = require('./mongo.js');
module.exports = {getCharacter, updateCharacter, deleteCharacter, insertCharacter, getWeapon, updateWeapon, deleteWeapon, insertWeapon, getUser, updateUser, deleteUser, insertUser};

async function getCharacter(value) {
    try {
        const document = mongo.getCollection("Character", { "_id": value });
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}
async function updateCharacter(name, data) {
    try {
        const document = mongo.updateElement("Character", "_id", name, data);
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}
async function deleteCharacter(name) {
    try {
        const document = mongo.deleteElement("Character", "_id", name);
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}
async function insertCharacter(data) {
    try {
        const document = mongo.insertElement(data, "Character");
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}
async function getWeapon(value) {
    try {
        const document = mongo.getCollection("Weapon", { "_id": value });
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}
async function updateWeapon(name, data) {
    try {
        const document = mongo.updateElement("Weapon", "_id", name, data);
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}
async function deleteWeapon(name) {
    try {
        const document = mongo.deleteElement("Weapon", "_id", name);
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}
async function insertWeapon(data) {
    try {
        const document = mongo.insertElement(data, "Weapon");
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}
async function getUser(value) {
    try {
        const document = mongo.getCollection("User", { "_id": value });
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}
async function updateUser(name, data) {
    try {
        const document = mongo.updateElement("User", "_id", name, data);
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}
async function deleteUser(name) {
    try {
        const document = mongo.deleteElement("User", "_id", name);
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}
async function insertUser(data) {
    try {
        const document = mongo.insertElement(data, "User");
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}