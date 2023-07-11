<script setup>
import { ref } from 'vue';
import STATUSES from '@/constants/statuses';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:modelValue']);

const subject = ref(props.modelValue);

function onUpdate() {
  emit('update:modelValue', subject.value);
}
</script>

<template lang="pug">
v-form
  v-card
    v-container
      v-row
        v-col
          v-text-field(
            v-model="subject.title"
            variant="outlined"
            placeholder="Mathematics"
            label="Title"
            @update:model-value="onUpdate"
          )
        v-col
          v-select(
            v-model="subject.isPublished"
            label="Status"
            variant="outlined"
            :items="STATUSES"
            item-title="label"
            item-value="value"
            @update:model-value="onUpdate"
          )
</template>