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

const id : string = data._id;
delete data._id;
delete data.skins;
console.log(data);

const llaves = Object.keys(data);
const valores = Object.values(data);
const items = {};
for (let i = 1; i < llaves.length; i++) {
    items[llaves[i]] = valores[i];
}
const itemToAdd = ref(items);

var selectedItem: any = ref([null]);
async function addSkin() {
    await $fetch(URL + '/changeParams', {
        method: 'POST',
    }).catch((error) => {
        console.log(error);
    }).then((result) => {
        console.log(result);
        reloadNuxtApp();
    });
}
var window = false;
</script>
<template>
    <v-card>
        <v-card-title>
            <h1>Game Parameters</h1>
        </v-card-title>
        <v-card-text>
            <v-row>
                
                <v-col style="display: flex; justify-content: center; align-items: center;" cols="9">
                    <v-row >
                        <v-col>
                            <v-text-field v-for="(value, key) in itemToAdd" :key="key" v-model="itemToAdd[key]" :label="key" type="text"></v-text-field>
                            <v-btn @click="addSkin"
                                color="primary">Save</v-btn>
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