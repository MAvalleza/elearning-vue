<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSubjects } from '@/stores/subjects';
import { useUI } from '@/stores/ui';
import { storeToRefs } from 'pinia';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import SubjectForm from '@/components/subjects/SubjectForm.vue';

// const router = useRouter();
const route = useRoute();

const uiStore = useUI();
const { loading } = storeToRefs(uiStore);

const HEADER_BUTTON_OPTS = {
  text: 'Save'
}

const subjectsStore = useSubjects();
const subject = ref({});

async function fetchSubject() {
  const id = route.params.id;

  subject.value = await subjectsStore.fetchSubject(id);
}

// function updateSubject() {
//   subjectsStore.createSubject(newSubject.value);

//   router.push({ name: 'subjects-list' });
// }

onMounted(() => {
  fetchSubject();
})
</script>

<template lang="pug">
app-loader(:is-visible="loading")

page-header(
  :title="route.meta.title"
  :button-opts="HEADER_BUTTON_OPTS"
)

page-content
  subject-form(:key="subject.id" v-model="subject")
</template>