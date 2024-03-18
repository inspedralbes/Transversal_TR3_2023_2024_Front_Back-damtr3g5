<script setup lang="ts">
const route = useRoute()
const people = ['Player', 'Monsters', 'Weapons']
const selected = ref(people[0])
const changeSelection = () => {
  if(selected.value === 'Player') {
    console.log('Player')
  } else if(selected.value === 'Monsters') {
    console.log('Monsters')
  } else if(selected.value === 'Weapons') {
    console.log('Weapons')
  }
}
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
        <SkinsList />
      </v-col>
    </v-row>

  </v-container>
</template>
