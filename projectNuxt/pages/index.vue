<script setup lang="ts">
import _ from 'lodash';
const URL = 'http://localhost:3450';

const { data, pending, error, refresh } = await useFetch(URL+'/getData', {
    method: 'GET'
})

let datos = ref({})
datos.value = data.value[0]

let llave = 0;
watch(datos, () => {
    llave++
});
const changeSelection = () => {
  if(selected.value === 'MainCharacter') {
    datos.value = data.value[0]
    console.log('Player')
  } else if(selected.value === 'Enemy') {
    datos.value = data.value[1]
    console.log('Monsters')
  } else if(selected.value === 'Weapons') {
    datos.value = data.value[2]
    console.log('Weapons')
  }
}
const route = useRoute()
const people = ['MainCharacter', 'Enemy', 'Weapons']
const selected = ref(people[0])
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-select label="Selecciona" :items="people" variant="solo-inverted" v-model="selected" v-on:update:model-value="changeSelection()"></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" >
        <SkinsList :data="datos" :folder="selected" :key="llave"/>
        <UpdateParams :data="datos" :key="llave"></UpdateParams>
      </v-col>
    </v-row>

  </v-container>
</template>
