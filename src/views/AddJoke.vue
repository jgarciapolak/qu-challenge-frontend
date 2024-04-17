<template>
  <div class="add_joke">
    <div class="add_joke-container">
      <router-link to="/" class="add_joke-back-button">
        <p>&#8592; Back to Home</p>
      </router-link>
      <h2>Create New Joke</h2>
      <!-- Create joke form -->
      <form @submit.prevent="createJoke" class="add_joke-form">
        <div class="add_joke-row">
          <label for="type">Type</label>
          <input type="text" id="type" v-model="type" class="add_joke-input" required>
        </div>
        <div class="add_joke-row">
          <label for="setup">Setup</label>
          <input type="text" id="setup" v-model="setup" class="add_joke-input" required>
        </div>
        <div class="add_joke-row">
          <label for="punchline">Punchline</label>
          <input type="text" id="punchline" v-model="punchline" class="add_joke-input" required>
        </div>
        <button type="submit" class="add_joke-btn-create">Create Joke</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddJoke",
  data() {
    return {
      type: '',
      setup: '',
      punchline: ''
    };
  },
  methods: {
    // creates a joke
    async createJoke() {
      // validations
      let error_message = '';
      if(!this.punchline){
        error_message = "Must define a punchline"
      }
      if(!this.setup){
        error_message = "Must define a setup"
      }
      if(!this.type){
        error_message = "Must define a type"
      }
      if(error_message){
        this.$toasted.error(error_message, {
          duration: 2000
        });
        return false;
      }
      // store dispatch
      await this.$store.dispatch('createJoke', {
        type: this.type,
        setup: this.setup,
        punchline: this.punchline
      });
      // toast
      this.$toasted.success('Joke created successfully', {
        duration: 2000
      });
      this.$router.push('/');
    }
  }
};
</script>

<style scoped src="@/assets/css/views/addJoke.css"></style>
