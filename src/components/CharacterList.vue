<template>
  <div>
    <ul>
      <li v-for="(character, index) in characters" :key="index">
        {{ character.name || character }}
        <button @click="removeCharacter(index)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CharacterList',
  data() {
    return {
      characters: JSON.parse(localStorage.getItem('characters') || '[]')
    };
  },
  methods: {
    removeCharacter(index) {
      this.characters.splice(index, 1);
      localStorage.setItem('characters', JSON.stringify(this.characters));
    }
  }
};
</script>

<style scoped>
button {
  margin-left: 0.5rem;
}
</style>
