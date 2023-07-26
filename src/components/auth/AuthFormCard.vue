<script setup>
import { objectifyArray } from '@/helpers/arrayHelper';
import { createRules } from '@/helpers/rulesHelper';
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Form',
  },
  /**
   * @param {Object[]} fields - The form fields
   * @param {String} fields[].value - For v-model usage
   * @param {String} fields[].component - The component to be used for the form field
   * @param {Object} fields[].componentOpts - The props for the component
   */
  fields: {
    type: Array,
    default: () => [],
  },
  /**
   * Props for the v-btn
   */
  buttonOpts: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['submit']);

const authForm = ref(null);

const formData = ref(objectifyArray(props.fields.map(f => f.value)));

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
  v-card(rounded="xl").text-center.pa-6
    v-card-item
      div
        router-link(:to="{ name: 'login'}").text-lg-h3 eLearning Portal
      div.text-md-h5.my-5 {{ props.title }}
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
