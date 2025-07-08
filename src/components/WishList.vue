<template>
  <div>
    <ul>
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
      items: JSON.parse(localStorage.getItem('wishlist') || '[]')
    };
  },
  methods: {
    removeItem(index) {
      this.items.splice(index, 1);
      localStorage.setItem('wishlist', JSON.stringify(this.items));
    }
  }
};
</script>

<style scoped>
button {
  margin-left: 0.5rem;
}
</style>
