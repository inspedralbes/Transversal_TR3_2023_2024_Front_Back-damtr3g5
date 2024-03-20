<script setup lang="ts">
import _ from 'lodash';
const URL = 'http://localhost:3450';
const props = defineProps({
    data: {
    required: true,
  }
});
const { data } = props;
var items: any = [/*
    {
        id: 1,
        name: 'default',
        price: 100,
        image: 'character-sheet.png'
    },
    {
        id: 2,
        name: 'skin 1',
        price: 120,
        image: 'character-sheet.png'
    },
    {
        id: 3,
        name: 'skin 2',
        price: 100,
        image: 'character-sheet.png'
    },
    {
        id: 4,
        name: 'skin 3',
        price: 200,
        image: 'character-sheet.png'
    },
    {
        id: 5,
        name: 'skin 4',
        price: 50,
        image: 'character-sheet.png'
    },
    {
        id: 6,
        name: 'skin 5',
        price: 100,
        image: 'character-sheet.png'
    },
    {
        id: 7,
        name: 'skin 6',
        price: 100,
        image: 'character-sheet.png'
    }
    ,
    {
        id: 8,
        name: 'skin 7',
        price: 1004,
        image: 'character-sheet.png'
    }*/
]
var activeItems: any = [];
items = [...data.skins];

activeItems = ref(_.cloneDeep(items));
const id : string = data._id;
var itemToAdd = ref({
    name: '',
    price: '',
    image: []
})

var selectedItem: any = ref([null]);
function updateSelectedItemName(item: any, event: any) {
    item.name = event.target.innerText;

}
function checkChanges() {
    const isEqual = _.isEqual(items, activeItems.value);
    if (!isEqual) {
        if (confirm("No has desat els canvis, els vols guardar?") == true) {
            items = _.cloneDeep(activeItems.value);
        } else {
            activeItems = ref(_.cloneDeep(items));
        }
    }
}
function saveChanges() {
    const isEqual = _.isEqual(items, activeItems.value);
    if (!isEqual) {
        items = _.cloneDeep(activeItems.value);
    }
}
function checkFields() {
    if (itemToAdd.value.name === '' || itemToAdd.value.price === '' || itemToAdd.value.image.length === 0) {
        return true;
    }
    return false;
}
async function addSkin() {
    console.log(itemToAdd.value.image[0]);
    const formData = new FormData();
    formData.append('file', itemToAdd.value.image[0]);
    formData.append('name', itemToAdd.value.name);
    formData.append('price', itemToAdd.value.price);
    formData.append('folder', 'mainCharacter');
    formData.append('id', id);
    //formData.append('price', itemToAdd.value.price);
    for(var pair of formData.entries()) {
        console.log(pair[0]+ ', '+ pair[1]);
    }
    await $fetch(URL + '/addskin', {
        method: 'POST',
        body: formData
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
            <h1>Skins</h1>
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="3">
                    <v-list v-model:selected="selectedItem" height="694" rounded="lg" lines="three">
                        <v-list-item style="border: 1px solid black;  justify-items: center;" variant="tonal"
                            color="green" @click="window = true" :value="null">
                            <v-list-item-title><v-icon icon="mdi-plus" size="x-large"></v-icon></v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="checkChanges" style="border: 1px solid black;" color="primary"
                            v-for="(item, i) in activeItems" :key="i" :value="item">
                            <v-list-item-title>{{ item.name }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-col>
                <v-col cols="9" v-if="selectedItem[0]">
                    <v-row>
                        <v-col>
                            <h1 style="text-decoration: underline; margin-bottom: 20px;"><span
                                    @input="updateSelectedItemName(selectedItem[0], $event)" contenteditable>{{
                        selectedItem[0]?.name }}</span>
                                <span class="mdi mdi-pencil-circle"></span>
                            </h1>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6">
                            <img :src="`${URL}/imagen/${selectedItem[0]?.path}`" alt="skin" height="600">
                        </v-col>
                        <v-col cols="6">
                            <input type="file">
                            <v-text-field label="Preu" v-model="selectedItem[0].price" type="text"></v-text-field>
                            <v-btn color="primary" @click="saveChanges">Save</v-btn>
                        </v-col>
                    </v-row>

                </v-col>
                <v-col style="display: flex; justify-content: center; align-items: center;" cols="9" v-else>
                    <v-row v-if="window">
                        <v-col>
                            <v-text-field v-model="itemToAdd.name" label="Nom" type="text"></v-text-field>
                            <v-text-field v-model="itemToAdd.price" label="Preu" type="text"></v-text-field>
                            <v-file-input v-model="itemToAdd.image" accept="image/*" label="Skin" counter show-size></v-file-input>
                            <v-btn @click="addSkin" :disabled="checkFields()"
                                color="primary">Save</v-btn>
                        </v-col>
                    </v-row>
                    <h1 v-else><v-icon icon="mdi-information"></v-icon>Selecciona una skin</h1>
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