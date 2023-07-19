<script setup>
import { ref } from 'vue';
import { STATUS_LABELS } from '@/constants/statuses';
import { REQUIRED_RULE } from '@/constants/validation-rules';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'submit']);

const subject = ref(props.modelValue);

function onUpdate() {
  emit('update:modelValue', subject.value);
}

const form = ref(null);

async function submit() {
  const { valid } = await form.value.validate();

  if (valid) {
    emit('submit', subject.value);
  }
}

defineExpose({ submit });
</script>

<template lang="pug">
v-form(ref="form" @submit.prevent="submit")
  v-card
    v-container(fluid)
      v-row
        v-col
          v-text-field(
            v-model="subject.title"
            variant="outlined"
            placeholder="Mathematics"
            label="Title"
            :disabled="props.loading"
            :rules="[REQUIRED_RULE]"
            @update:model-value="onUpdate"
          )
        v-col
          v-select(
            v-model="subject.isPublished"
            label="Status"
            variant="outlined"
            item-title="label"
            item-value="value"
            :disabled="props.loading"
            :items="STATUS_LABELS"
            @update:model-value="onUpdate"
          )
</template>
