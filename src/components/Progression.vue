<template>
  <div class="list-container">
    <form class="add-form" @submit.prevent="addPlayer">
      <input v-model="newPlayer" placeholder="Add player" />
      <button type="submit">Add</button>
    </form>
    <ul class="player-list">
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
      players: JSON.parse(localStorage.getItem('players') || '[]'),
      newPlayer: ''
    };
  },
  methods: {
    addPlayer() {
      const name = this.newPlayer.trim();
      if (name) {
        this.players.push(name);
        localStorage.setItem('players', JSON.stringify(this.players));
        this.newPlayer = '';
      }
    },
    removePlayer(index) {
      const name = this.players[index];
      const confirmation = prompt('Enter the name to delete:');
      if (confirmation === name) {
        this.players.splice(index, 1);
        localStorage.setItem('players', JSON.stringify(this.players));
      }
    }
  }
};
</script>

<style scoped>
.list-container {
  max-width: 400px;
  margin: 1rem auto;
  padding: 1rem;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.add-form {
  display: flex;
  margin-bottom: 1rem;
}

.add-form input {
  flex: 1;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.add-form button {
  margin-left: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.add-form button:hover {
  background-color: #0056b3;
}

.player-list li {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
}

.player-list button {
  background-color: #dc3545;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  color: white;
  cursor: pointer;
}

.player-list button:hover {
  background-color: #a71d2a;
}
</style>
