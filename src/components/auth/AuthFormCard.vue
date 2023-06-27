<script setup>
import { objectifyArray } from '@/helpers/arrayHelper';
import { createRules } from '@/helpers/rulesHelper';
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Form',
  },
  fields: {
    type: Array,
    default: () => ([]),
  },
  // Props for v-btn
  buttonOpts: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['submit']);

const authForm = ref(null);

const formData = ref(objectifyArray(
  props.fields.map(f => f.value)
));

async function onSubmit() {
  const { valid } = await authForm.value.validate();
  if (valid) {
    emit('submit', formData.value);
    await authForm.value.reset();
  }
}
</script>

<template lang="pug">
v-form(ref="authForm" @submit.prevent="onSubmit")
  v-card.text-center.pa-6
    v-card-item
      v-card-title eLearning Portal
      v-card-subtitle {{ props.title }}
    v-card-text.ma-5
      component(
        :is="field.component"
        v-for="(field, key) in fields"
        :key="key"
        v-bind="field.componentOpts"
        v-model="formData[field.value]"
        :rules="createRules(field, formData)"
      )
      slot(name="append-form")
    v-card-actions.justify-center
      v-btn(v-bind="buttonOpts" type="submit")
    slot(name="append-form-actions")
</template>