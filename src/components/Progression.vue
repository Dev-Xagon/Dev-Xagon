<template>
  <div>
    <ul>
      <li v-for="(player, index) in players" :key="index">
        {{ player }}
        <button @click="removePlayer(index)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Progression',
  data() {
    return {
      players: JSON.parse(localStorage.getItem('players') || '[]')
    };
  },
  methods: {
    removePlayer(index) {
      this.players.splice(index, 1);
      localStorage.setItem('players', JSON.stringify(this.players));
    }
  }
};
</script>

<style scoped>
button {
  margin-left: 0.5rem;
}
</style>
