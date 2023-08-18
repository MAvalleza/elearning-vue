<script setup lang="ts">
import GenericContainer from './GenericContainer.vue';
</script>

<template lang="pug">
generic-container
  v-card.mt-n10.pt-5.rounded-lg
    slot(name="default")
</template>
