<script setup lang="ts">
import _ from 'lodash';
const URL = 'http://localhost:3450';
const props = defineProps({
    data: {
        required: true,
        type: Object
    }
});
const { data } = props;
console.log(data);

let char = ref({})
char.value = { ...data }

const id: string = char.value._id;
delete char.value.skins;
delete char.value._id;
delete char.value.name;
console.log(id);

const llaves = Object.keys(char.value);
const valores = Object.values(char.value);
const items = {};
for (let i = 0; i < llaves.length; i++) {
    items[llaves[i].toUpperCase()] = valores[i].toString();
}
const newItem = ref({})
newItem.value = { ...items }
const itemToAdd = ref(items);
function checkChanges(object1: Object, object2: Object) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (object1[key] !== object2[key]) {
            return false;
        }
    }

    return true;
}
function bodyCreate() {
    const body = {
        id: id,
        ...itemToAdd.value
    };

    const lowercaseBody = {};
    Object.keys(body).forEach(key => {
        lowercaseBody[key.toLowerCase()] = key === 'id' ? body[key] : parseFloat(body[key]);
    });

    return lowercaseBody;
}

function collection(object1: Object) {
    const keys1 = Object.keys(object1);
    let char = keys1.some((key) => key === 'hp');
    if (char) {
        return 'Character';
    } else {
        return 'Weapons';
    }
}
async function addSkin() {
    const body = bodyCreate()
    await $fetch(URL + `/changeParam?collection=${collection(itemToAdd.value)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    }).catch((error) => {
        console.log(error);
    }).then((result) => {
        console.log(result);
        reloadNuxtApp();
    });
}
</script>
<template>
    <v-card>
        <v-card-title>
            <h1>Game Parameters</h1>
        </v-card-title>
        <v-card-text>
            <v-row>

                <v-col style="display: flex; justify-content: center; align-items: center;" cols="9">
                    <v-row>
                        <v-col>
                            <v-text-field v-for="(value, key) in itemToAdd" :key="key" v-model="itemToAdd[key]"
                                :label="key" type="text"></v-text-field>
                            <v-btn @click="addSkin" color="primary"
                                :disabled="checkChanges(itemToAdd, newItem)">Update</v-btn>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

        </v-card-text>
    </v-card>
</template>
<style scoped>
[contenteditable] {
    outline: 0px solid transparent;
}
</style>