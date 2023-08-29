<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { convertToHTML } from '@/helpers/quillFormatHelper';
import { Delta } from '@vueup/vue-quill';

interface Props {
  content: Delta;
}
const props = withDefaults(defineProps<Props>(), {
  content: () => (<Delta>{}),
});

const renderedContent: Ref = ref(null);

onMounted(() => {
  const renderedHTML = convertToHTML(props.content);
  renderedContent.value.innerHTML = renderedHTML;
})
</script>

<template lang="pug">
div(ref="renderedContent").rendered-content
</template>