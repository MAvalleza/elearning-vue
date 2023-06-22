<script setup>
const props = defineProps({
  formTitle: {
    type: String,
    default: 'Form'
  },
});
</script>

<template lang="pug">
v-card.text-center
  v-card-item
    v-card-title eLearning Portal
    v-card-subtitle {{ props.formTitle }}
  v-card-text
    slot(name="default")
</template>