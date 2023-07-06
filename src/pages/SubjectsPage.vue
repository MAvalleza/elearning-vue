<script setup>
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { useSubjects } from '@/stores/subjects';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';

const route = useRoute();

const HEADER_BUTTON_OPTS = {
  text: 'ADD NEW SUBJECT',
  flat: true,
};

const subjectsStore = useSubjects();

async function fetchSubjects() {
  await subjectsStore.fetchSubjects();
}

onMounted(() => {
  fetchSubjects();
})
</script>

<template lang="pug">
page-header(
  :title="route.meta.title"
  :button-opts="HEADER_BUTTON_OPTS"
)

page-content
  h1 Content here
</template>
