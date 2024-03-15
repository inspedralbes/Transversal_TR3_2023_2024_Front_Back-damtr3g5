<script setup lang="ts">
import _ from 'lodash';
var items = [
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
]
var activeItems = ref(_.cloneDeep(items));
var selectedItem = ref(activeItems.value[0]);
function updateSelectedItemName(item, event) {
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
</script>
<template>
    <v-card>
        <v-card-title>
            <h1>Skins</h1>
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-col cols="3">
                    <v-list v-model:selected="selectedItem" height="600" rounded="lg" lines="three">
                        <v-list-item @click="checkChanges" style="border: 1px solid black;" active-class="listactive"
                            variant="plain" v-for="(item, i) in activeItems" :key="i" :value="item">
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
                            <img :src="`/${selectedItem[0]?.image}`" alt="skin" height="600">
                        </v-col>
                        <v-col cols="6">
                            <input type="file">
                            <v-text-field label="Price" v-model="selectedItem[0].price" type="text"></v-text-field>
                            <v-btn color="primary" @click="console.log(activeItems, items)">Save</v-btn>
                        </v-col>
                    </v-row>

                </v-col>
                <v-col style="display: flex; justify-content: center; align-items: center;" cols="9" v-else>
                    <h1><v-icon icon="mdi-information"></v-icon>Selecciona una skin</h1>
                </v-col>
            </v-row>

        </v-card-text>
    </v-card>
</template>
<style scoped>
.listactive {
    background-color: #f09898;
}

[contenteditable] {
    outline: 0px solid transparent;
}
</style>