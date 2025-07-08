<template>
  <div>
    <h2>Charaktere</h2>
    <form @submit.prevent="addCharacter">
      <input v-model="character.name" placeholder="Name" />
      <input v-model="character.class" placeholder="Klasse" />
      <input v-model="character.race" placeholder="Volk" />
      <input v-model.number="character.level" type="number" placeholder="Level" />
      <input v-model="character.portrait" placeholder="Portrait URL" />
      <button type="submit">Hinzufügen</button>
    </form>
    <ul>
      <li v-for="char in characters" :key="char.name">
        <img :src="char.portrait" alt="portrait" width="50" />
        {{ char.name }} ({{ char.class }} {{ char.level }}, {{ char.race }})
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      character: { name: '', class: '', race: '', level: 1, portrait: '' },
      characters: JSON.parse(localStorage.getItem('characters') || '[]')
    }
  },
  methods: {
    save() {
      localStorage.setItem('characters', JSON.stringify(this.characters))
    },
    addCharacter() {
      if (!this.character.name) return
      this.characters.push({ ...this.character })
      this.character = { name: '', class: '', race: '', level: 1, portrait: '' }
      this.save()
    }
  }
}
</script>
