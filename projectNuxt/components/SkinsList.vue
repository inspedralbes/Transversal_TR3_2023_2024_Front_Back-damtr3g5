<script setup lang="ts">
const items = [
    {
        id: 1,
        name: 'default',
        image: 'default.png'
    },
    {
        id: 2,
        name: 'skin 1',
        image: 'skin1.png'
    },
    {
        id: 3,
        name: 'skin 2',
        image: 'skin2.png'
    },
    {
        id: 4,
        name: 'skin 3',
        image: 'skin3.png'
    },
    {
        id: 5,
        name: 'skin 4',
        image: 'skin4.png'
    },
    {
        id: 6,
        name: 'skin 5',
        image: 'skin5.png'
    },
    {
        id: 7,
        name: 'skin 6',
        image: 'skin6.png'
    }
]
var selectedItem = ref(items[0])
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
                        <v-list-item style="border: 1px solid black;" active-class="listactive" variant="plain" v-for="(item, i) in items" :key="i" :value="item">
                            <v-list-item-title>{{ item.name }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-col>
                <v-col cols="9">
                    {{ selectedItem }}
                </v-col>
            </v-row>

        </v-card-text>
    </v-card>
</template>
<style scoped>
.listactive {
    background-color: #f09898;
}
</style>