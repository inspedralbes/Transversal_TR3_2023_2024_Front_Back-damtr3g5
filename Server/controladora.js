const mongo = require('./mongo.js');
module.exports = {getCharacter, updateCharacter, deleteCharacter, insertCharacter, getWeapon, updateWeapon, deleteWeapon, insertWeapon, getUser, updateUser, deleteUser, insertUser
, updateCharacterParameters};

async function getCharacter(id) {
    try {
        const document = mongo.getCollection("Character", { "_id": id });
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}
async function updateCharacter(id, data) {
    try {
        const document = mongo.updateElement("Character", "_id", id, data);
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}

async function updateCharacterParameters(id, parameter, newValue) {
    try {
        const personaje = mongo.getCollection("Character", { "_id": id })[0];
        personaje[parameter] = newValue;
        const document = mongo.updateElement("Character", "_id", id, personaje);
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}
async function deleteCharacter(id) {
    try {
        const document = mongo.deleteElement("Character", "_id", id);
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
async function getWeapon(id) {
    try {
        const document = mongo.getCollection("Weapon", { "_id": id });
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}
async function updateWeapon(id, data) {
    try {
        const document = mongo.updateElement("Weapon", "_id", id, data);
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}
async function deleteWeapon(id) {
    try {
        const document = mongo.deleteElement("Weapon", "_id", id);
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
async function getUser(id) {
    try {
        const document = mongo.getCollection("User", { "_id": id });
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}
async function updateUser(id, data) {
    try {
        const document = mongo.updateElement("User", "_id", id, data);
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}
async function deleteUser(id) {
    try {
        const document = mongo.deleteElement("User", "_id", id);
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}
async function insertUser(data) {
    try {
        mongo.insertElement(data, "User");
    } catch (err) {
        console.log(err.stack);
    }
}
async function addSkin(skin, character) {
    try {
        const skinInsertada = mongo.insertElement(skin,"Skin");
        const personaje = mongo.getCollection("Character", { "_id": skinInsertada })[0];
        return document;
    } catch (err) {
        console.log(err.stack);
    }
}