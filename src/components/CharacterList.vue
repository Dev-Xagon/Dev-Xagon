<template>
  <div>
    <form @submit.prevent="addCharacter">
      <input v-model="newCharacter" placeholder="Add character" />
      <button type="submit">Add</button>
    </form>

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
      characters: JSON.parse(localStorage.getItem('characters') || '[]'),
      newCharacter: ''
    };
  },
  methods: {
    addCharacter() {
      const name = this.newCharacter.trim();
      if (name) {
        this.characters.push(name);
        localStorage.setItem('characters', JSON.stringify(this.characters));
        this.newCharacter = '';
      }
    },
    removeCharacter(index) {
      const character = this.characters[index];
      const name = character.name || character;
      const confirmation = prompt('Enter the name to delete:');
      if (confirmation === name) {
        this.characters.splice(index, 1);
        localStorage.setItem('characters', JSON.stringify(this.characters));
      }
    }
  }
};
</script>

<style scoped>
button {
  margin-left: 0.5rem;
}
</style>
