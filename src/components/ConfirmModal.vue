<template>
  <div v-if="visible" class="modal">
    <div class="modal-content">
      <p>{{ message }}</p>
      <div class="button-container">
        <button @click="confirm">Confirm</button>
        <button class="button-cancel" @click="cancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: String,
    visible: Boolean
  },
  methods: {
    confirm() {
      this.$emit('confirmed');
    },
    cancel() {
      this.$emit('canceled');
    }
  }
};
</script>

<style scoped src="@/assets/css/components/modal.css"></style>