<script setup lang="ts">
import { ref, type Ref, computed } from 'vue';
import { Delta, QuillEditor } from '@vueup/vue-quill';
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const props = defineProps({
  modelValue: {
    type: [Delta, Object],
    default: () => ({}),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const content = computed({
  get() {
    return new Delta(props.modelValue?.ops || {});
  },
  set(val) {
    emit('update:modelValue', val);
  },
});

const modules: Ref = ref({
  name: 'blotFormatter',
  module: BlotFormatter,
});

const toolbarOptions: Ref = ref([
  { header: [1, 2, 3, 4, 5, 6, false] },
  'bold',
  'italic',
  'underline',
  { list: 'ordered' },
  { list: 'bullet' },
  'link',
  'image',
  'video',
]);
</script>

<template lang="pug">
quill-editor(
  v-model:content="content"
  :modules="modules"
  :toolbar="toolbarOptions"
  :read-only="props.disabled"
)
</template>
