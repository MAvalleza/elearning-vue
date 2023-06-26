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

const formData = ref(objectifyArray(
  props.fields.map(f => f.value)
));
</script>

<template lang="pug">
v-form(@submit.prevent)
  v-card.text-center.pa-3
    v-card-item
      v-card-title eLearning Portal
      v-card-subtitle {{ props.title }}
      pre {{ formData }}
    v-card-text.ma-5
      component(
        :is="field.component"
        v-for="(field, key) in fields"
        :key="key"
        v-bind="field.componentOpts"
        v-model="formData[field.value]"
        :rules="createRules(field, formData)"
      )
    v-card-actions.justify-center
      v-btn(v-bind="buttonOpts")
</template>