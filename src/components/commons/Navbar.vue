<script setup>
import { ref } from 'vue';

const drawer = ref(true);
</script>

<template lang="pug">
v-app-bar(color="primary")
  v-app-bar-nav-icon(color="white" variant="text" @click.stop="drawer = !drawer")
  v-app-bar-title.text-h5
    router-link(:to="{ name: 'index' }").app-bar-title.font-weight-bold eLearning Portal

v-navigation-drawer(
  v-model="drawer"
  location="left"
)
</template>

<style scoped>
.app-bar-title {
  color: white !important;
}
</style>
