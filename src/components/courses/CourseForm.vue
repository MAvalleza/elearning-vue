<script setup>
import { ref } from 'vue';
import { STATUS_LABELS } from '@/constants/statuses';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:modelValue']);

const course = ref(props.modelValue);

function onUpdate() {
  emit('update:modelValue', course.value);
}
</script>

<template lang="pug">
v-form
  v-card
    v-container(fluid)
      v-row
        v-col(cols="12" lg="6")
          v-text-field(
            variant="outlined"
            placeholder="Mathematics"
            label="Title"
            @update:model-value="onUpdate"
          )
        v-col(cols="12" lg="6")
          v-autocomplete(
            label="Subject"
            variant="outlined"
            :items="[]"
          )
        v-col(cols="12" lg="6")
          v-autocomplete(
            label="Author"
            variant="outlined"
            :items="[]"
          )
        v-col(cols="12" lg="6")
          v-select(
            label="Status"
            variant="outlined"
            :items="STATUS_LABELS"
            item-title="label"
            item-value="value"
          )
        v-col(cols="12")
          v-text-field(
            variant="outlined"
            label="Course Description"
            placeholder="e.g. A basic course"
          )
</template>