<script setup lang="ts">
import _ from 'lodash';
const URL = 'http://localhost:3450';

const { data, pending, error, refresh } = await useFetch(URL+'/getData', {
    method: 'GET'
})
console.log(data.value);

var datos = (data.value as any)[0];
const changeSelection = () => {
  if(selected.value === 'MainCharacter') {
    datos = (data.value as any)[0]
    console.log('Player')
  } else if(selected.value === 'Enemy') {
    datos = (data.value as any)[1]
    console.log('Monsters')
  } else if(selected.value === 'Weapons') {
    datos = (data.value as any)[2]
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
      <v-col cols="12">
        <SkinsList :data="datos"/>
        <UpdateParams :data="datos"></UpdateParams>
      </v-col>
    </v-row>

  </v-container>
</template>
