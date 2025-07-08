<template>
  <div>
    <h2>Progressionspunkte</h2>
    <form @submit.prevent="addPlayer">
      <input v-model="newPlayer" placeholder="Spielername" />
      <button type="submit">Hinzufügen</button>
    </form>
    <ul>
      <li v-for="player in players" :key="player.name">
        {{ player.name }} - {{ player.points }} PP
        <button @click="addPoints(player, 10)">+10 Teilnahme</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newPlayer: '',
      players: JSON.parse(localStorage.getItem('players') || '[]')
    }
  },
  methods: {
    save() {
      localStorage.setItem('players', JSON.stringify(this.players))
    },
    addPlayer() {
      if (!this.newPlayer) return
      this.players.push({ name: this.newPlayer, points: 0 })
      this.newPlayer = ''
      this.save()
    },
    addPoints(player, pts) {
      player.points += pts
      this.save()
    }
  }
}
</script>
