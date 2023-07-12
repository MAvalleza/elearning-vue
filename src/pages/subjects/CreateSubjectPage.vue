<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSubjects } from '@/stores/subjects';
import { useUI } from '@/stores/ui';
import { storeToRefs } from 'pinia';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import SubjectForm from '@/components/subjects/SubjectForm.vue';

const router = useRouter();
const route = useRoute();

const uiStore = useUI();
const { loading } = storeToRefs(uiStore);

const HEADER_BUTTON_OPTS = {
  text: 'Save'
}

const subjectsStore = useSubjects();
const newSubject = ref({ title: null, isPublished: null })

function createSubject() {
  subjectsStore.createSubject(newSubject.value);

  router.push({ name: 'subjects-list' });
}
</script>

<template lang="pug">
app-loader(:is-visible="loading")

page-header(
  :title="route.meta.title"
  :button-opts="HEADER_BUTTON_OPTS"
  @click="createSubject"
)

page-content
  subject-form(v-model="newSubject")
</template>