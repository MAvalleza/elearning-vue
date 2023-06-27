<script setup>
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
});
</script>

<template lang="pug">
v-overlay(
  :model-value="props.isVisible"
).align-center.justify-center
  v-progress-circular(color="primary" indeterminate size="64")
</template>
