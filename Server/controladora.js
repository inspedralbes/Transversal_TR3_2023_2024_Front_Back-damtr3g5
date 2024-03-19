const mongo = require('./mongo.js');
const ObjectId = require("mongodb").ObjectId;
module.exports = {
    getCharacter, updateCharacter, deleteCharacter, insertCharacter, getWeapon, updateWeapon, deleteWeapon, insertWeapon, getUser, updateUser, deleteUser, insertUser
    , updateCharacterParameters, addSkin, changeSkinParameters, changeCharacterParameters, changeValueGeneric, changeWeaponParameters,objectData
};

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
async function addSkin(path, skin, idCharacter) {
    try {
        await mongo.insertElement({ name: skin.name, price: skin.price, path: path }, "Skin");
        const res = await mongo.getCollection("Skin", { "name": skin.name });
        const skinInsertadaId = res[0]._id;
        let personaje = await mongo.getElement("Character", "_id", new ObjectId(idCharacter));
        personaje.skins.push(skinInsertadaId);
        await mongo.updateElement("Character", "_id", new ObjectId(idCharacter), personaje);
        //return document;
    } catch (err) {
        console.log(err.stack);
    }
}
async function changeValueGeneric(id, collection, parameter, newValue) {
    try {
        const document = await mongo.getElement(collection, "_id", new ObjectId(id));
        document[parameter] = newValue;
        await mongo.updateElement(collection, "_id", new ObjectId(id), document);
    } catch (err) {
        console.log(err.stack);
    }
}
async function changeSkinParameters(id, parameter, newSkin) {
    try {
        const skin = await mongo.getElement("Skin", "_id", new ObjectId(id));
        skin[parameter] = newSkin;
        await mongo.updateElement("Skin", "_id", new ObjectId(id), skin);
    } catch (err) {
        console.log(err.stack);
    }
}
function changeCharacterParameters(id, parameter, newValue) {
    const personaje = mongo.getCollection("Character", { "_id": new ObjectId(id) })[0];
    personaje[parameter] = newValue;
    mongo.updateElement("Character", "_id", new ObjectId(id), personaje);
}
function changeWeaponParameters(id, parameter, newValue) {
    const personaje = mongo.getCollection("Weapon", { "_id": new ObjectId(id) })[0];
    personaje[parameter] = newValue;
    mongo.updateElement("Weapon", "_id", new ObjectId(id), personaje);
}
async function objectData(collection, char) {
    let data = []
    if (collection != undefined) {
        let personaje = await mongo.getCollection(collection);
        personaje = personaje.filter((e) => e.name == char);
        for (let element of personaje) {
            if (element.name == char) {
                await Promise.all(element.skins.map(async (id, index) => {
                    let dato = await mongo.getElement("Skin", "_id", new ObjectId(id));
                    element.skins[index] = dato;
                }));
            }
        }
        data = personaje
    } else {
        let personaje = await mongo.getCollection("Character");
        for (let element of personaje) {
            await Promise.all(element.skins.map(async (id, index) => {
                let dato = await mongo.getElement("Skin", "_id", new ObjectId(id));
                element.skins[index] = dato;
            }));

        }
        let armas = await mongo.getCollection("Weapon");
        for (let element of armas) {
            await Promise.all(element.skins.map(async (id, index) => {
                let dato = await mongo.getElement("Skin", "_id", new ObjectId(id));
                element.skins[index] = dato;
            }));

        }
        data = personaje.concat(armas);
    }
    return data;
}
/*{
  "_id": {
    "$oid": "65f2bb52231b4346440019a2"
  },
  "name": "MainCharacter",
  "hp": 100,
  "speed": 5,
  "skins": [
    {
      "$oid": "65f409dd19eed22c1e68b72b"
    }
  ]
}*/