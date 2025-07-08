<template>
  <div>
    <h2>Wunsch-Gegenstände</h2>
    <form @submit.prevent="addItem">
      <input v-model="newItem" placeholder="Gegenstand" />
      <button type="submit">Hinzufügen</button>
    </form>
    <ul>
      <li v-for="(item, idx) in items" :key="idx">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newItem: '',
      items: JSON.parse(localStorage.getItem('items') || '[]')
    }
  },
  methods: {
    save() {
      localStorage.setItem('items', JSON.stringify(this.items))
    },
    addItem() {
      if (!this.newItem) return
      this.items.push(this.newItem)
      this.newItem = ''
      this.save()
    }
  }
}
</script>
