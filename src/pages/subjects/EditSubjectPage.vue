<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSubjects } from '@/stores/subjects';
import { useUI } from '@/stores/ui';
import { storeToRefs } from 'pinia';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import SubjectForm from '@/components/subjects/SubjectForm.vue';
import CoursesListTable from '@/components/courses/CoursesListTable.vue';

const router = useRouter();
const route = useRoute();

const uiStore = useUI();
const { loading } = storeToRefs(uiStore);

const HEADER_BUTTON_OPTS = {
  text: 'Save',
};

const subjectsStore = useSubjects();
const subjectId = ref(route.params.id);
const subject = ref({});

async function fetchSubject() {
  subject.value = await subjectsStore.fetchSubject(subjectId.value, {
    join: ['courses'],
  });
}

const form = ref(null);
function submitForm() {
  form.value.submit();
}

async function updateSubject() {
  await subjectsStore.updateSubject(subjectId.value, subject.value);

  router.push({ name: 'subjects-list' });
}

const tab = ref('form');

onMounted(() => {
  fetchSubject();
});
</script>

<template lang="pug">
app-loader(:is-visible="loading")

page-header(
  :title="subject.title || route.meta.title"
  :button-opts="HEADER_BUTTON_OPTS"
  @click="submitForm"
)

page-content
  v-card
    v-tabs(v-model="tab")
      v-tab(value="form") Subject
      v-tab(value="courses") Courses

    v-window(v-model="tab").pt-10
      v-window-item(value="form")
        subject-form(
          ref="form"
          :key="subject.id"
          v-model="subject"
          :loading="loading"
          @submit="updateSubject"
        )
      v-window-item(value="courses")
        v-card
          courses-list-table(
            component="v-data-table"
            :loading="loading"
            :items="subject.courses || []"
            hide-subject-column
          )
</template>
