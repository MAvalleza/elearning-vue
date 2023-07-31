<script setup lang="ts">
import { ref, type Ref, computed } from 'vue';
import { Delta, QuillEditor } from '@vueup/vue-quill';
import BlotFormatter from 'quill-blot-formatter'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const props = defineProps({
  modelValue: {
    type: Delta,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const content = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  }
});

const modules: Ref = ref({
  name: 'blotFormatter',
  module: BlotFormatter,
});

const toolbarOptions: Ref = ref([
  { 'header': [1, 2, 3, 4, 5, 6, false] },
  'bold', 'italic', 'underline',
  { 'list': 'ordered' }, { 'list': 'bullet' },
  'link',
  'image',
  'video',
])
</script>

<template lang="pug">
quill-editor(
  v-model:content="content"
  :modules="modules"
  :toolbar="toolbarOptions"
)
</template>