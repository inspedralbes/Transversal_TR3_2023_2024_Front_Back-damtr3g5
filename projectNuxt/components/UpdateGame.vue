<script setup lang="ts">
import _ from 'lodash';
const URL = 'http://localhost:3450';

const { data, pending, error, refresh } = await useFetch(URL + '/gameparams', {
    method: 'GET'
})


let char = { ...data.value }
const id: string = char._id;
delete char._id;


const llaves = Object.keys(char);
const valores = Object.values(char);
const items = {};

for (let i = 0; i < llaves.length; i++) {
    items[llaves[i]] = valores[i];
}

let newItem = ref({})
newItem = _.cloneDeep(items);

let itemToAdd = ref(_.cloneDeep(items));

function checkChanges(object1: Object, object2: Object) {
    for (let key in object1) {
        for (let paramKey in object1[key]) {
            if (object1[key][paramKey] !== object2[key][paramKey]) {
                return false; // Si hay un cambio, devolver true
            }
        }
    }
    return true; // Si no hay cambios, devolver false
}
function bodyCreate() {
    const lowercaseBody = {};
    Object.keys(itemToAdd.value).forEach(key => {
        lowercaseBody[key] = {}; // Inicializa lowercaseBody[key] como un objeto vacío
        Object.keys(itemToAdd.value[key]).forEach(paramKey => {
            lowercaseBody[key][paramKey] = parseFloat(itemToAdd.value[key][paramKey]);
        });
    });
    lowercaseBody.id = id;
    return lowercaseBody;
}


async function addSkin() {
    const body = bodyCreate()
    await $fetch(URL + `/updategameparams`, {
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
                            <div v-for="(value, key) in itemToAdd" :key="key">
                                <h2 style="margin-bottom: 10px;">{{ key.toUpperCase() }}</h2>
                                <div v-for="(paramValue, paramKey) in itemToAdd[key]" :key="paramKey">
                                    <span>{{ paramKey.replace('_', ' ').toUpperCase() }}</span><v-text-field
                                        v-model="itemToAdd[key][paramKey]"
                                        :label="paramKey.replace('_', ' ').toUpperCase()" type="text"></v-text-field>
                                </div>

                            </div>
                            <v-btn @click="addSkin" color="primary"
                                :disabled="checkChanges(newItem, itemToAdd)">Update</v-btn>
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