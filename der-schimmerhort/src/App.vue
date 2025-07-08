<template>
  <div>
    <h1>Der Schimmerhort</h1>
    <nav>
      <button @click="view='progression'">Progression</button>
      <button @click="view='characters'">Charaktere</button>
      <button @click="view='items'">Wunschliste</button>
    </nav>
    <Progression v-if="view==='progression'" />
    <CharacterList v-if="view==='characters'" />
    <WishList v-if="view==='items'" />
  </div>
</template>

<script>
import Progression from './components/Progression.vue'
import CharacterList from './components/CharacterList.vue'
import WishList from './components/WishList.vue'

export default {
  components: { Progression, CharacterList, WishList },
  data() {
    return { view: 'progression' }
  }
}
</script>

<style>
nav button {
  margin-right: 10px;
}
</style>
