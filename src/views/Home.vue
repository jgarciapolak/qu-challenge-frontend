<template>
  <div class="home">
    <Table :jokes="jokes" />
    <router-link to="/add">
      <button>Create New Joke</button>
    </router-link>
  </div>
</template>

<script>
import Table from '@/components/Table.vue'

export default {
  name: 'Home',
  components: {
    Table
  },
  data() {
    return {
    }
  },
  computed: {
    jokes() {
      return this.$store.getters.getJokes;
    }
  },
  mounted() {
    this.$store.dispatch('fetchJokes');
  }
}
</script>

<style src="@/assets/css/views/home.css"></style>