<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { RESOURCE_STATUS_LABELS } from '@/constants/statuses';
import { REQUIRED_RULE } from '@/constants/validation-rules';

// PROPS AND EMITS
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'submit']);
//

// SUBJECT MODEL
const subject = ref(props.modelValue);

// Data update
function onUpdate() {
  emit('update:modelValue', subject.value);
}
//

// FORM HANDLER
const form: Ref = ref(null);

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
            :disabled="props.loading || props.disabled"
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
            :disabled="props.loading || props.disabled"
            :items="RESOURCE_STATUS_LABELS"
            @update:model-value="onUpdate"
          )
</template>
