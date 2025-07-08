<template>
  <div class="list-container">
    <form class="add-form" @submit.prevent="addItem">
      <input v-model="newItem" placeholder="Add item" />
      <button type="submit">Add</button>
    </form>
    <ul class="item-list">
      <li v-for="(item, index) in items" :key="index">
        {{ item }}
        <button @click="removeItem(index)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'WishList',
  data() {
    return {
      items: JSON.parse(localStorage.getItem('wishlist') || '[]'),
      newItem: ''
    };
  },
  methods: {
    addItem() {
      const item = this.newItem.trim();
      if (item) {
        this.items.push(item);
        localStorage.setItem('wishlist', JSON.stringify(this.items));
        this.newItem = '';
      }
    },
    removeItem(index) {
      const name = this.items[index];
      const confirmation = prompt('Enter the name to delete:');
      if (confirmation === name) {
        this.items.splice(index, 1);
        localStorage.setItem('wishlist', JSON.stringify(this.items));
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
  background-color: #28a745;
  color: white;
  cursor: pointer;
}

.add-form button:hover {
  background-color: #1e7e34;
}

.item-list li {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
}

.item-list button {
  background-color: #dc3545;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  color: white;
  cursor: pointer;
}

.item-list button:hover {
  background-color: #a71d2a;
}
</style>
