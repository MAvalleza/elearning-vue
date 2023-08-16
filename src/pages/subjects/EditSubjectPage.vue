<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import { useSubjects } from '@/stores/subjects';
import { useCourses } from '@/stores/courses';
import { useUI } from '@/stores/ui';
import { storeToRefs } from 'pinia';
import { type TableActionOpt, type GenericTableItem } from '@/types/data-table';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import PageConfirmDialog from '@/components/commons/ConfirmDialog.vue';
import SubjectForm from '@/components/subjects/SubjectForm.vue';
import CoursesListTable from '@/components/courses/CoursesListTable.vue';

// Router
const router = useRouter();
const route = useRoute();

// UI States
const uiStore = useUI();
const { loading } = storeToRefs(uiStore);

const confirmDialog: Ref = ref(null);
const tab = ref('form');
const HEADER_BUTTON_OPTS = {
  text: 'Save',
};

// Subject operations
const subjectsStore = useSubjects();
const { currentSubject, loadingSubjects } = storeToRefs(subjectsStore);
const subject = ref({});
const subjectId: Ref = ref(route.params.subjectId);

async function fetchSubject() {
  await subjectsStore.fetchSubject(subjectId.value, {
    join: ['courses'],
  });

  subject.value = { ...currentSubject.value };
}

async function updateSubject() {
  await subjectsStore.updateSubject(subjectId.value, subject.value);

  router.push({ name: 'subjects-list' });
}

// Form
const form: Ref = ref(null);
function submitForm() {
  form.value.submit();
}

// Course Operations
const coursesStore = useCourses();

function editCourse(_event: Event, { item }: GenericTableItem) {
  router.push({
    name: 'subject-edit-course',
    params: {
      subjectId: subjectId.value,
      courseId: item.raw.id,
    },
  });
}

async function deleteCourse(id: string) {
  const confirm = await confirmDialog.value.open({
    title: 'Delete Course',
    message:
      'Deleting a course will also delete its modules, are you sure you want to delete this course?',
    primaryAction: 'DELETE',
    primaryColor: 'error',
  });

  if (confirm) {
    await coursesStore.deleteCourse(id);
  }
}

// Table operations
async function onAction({ action, item }: TableActionOpt) {
  const id = item.raw.id;
  const result = await coursesStore.onTableAction({ id, action });

  if (result?.delete) await deleteCourse(id);

  // Re-fetch
  fetchSubject();
}

onMounted(() => {
  fetchSubject();
});

onBeforeRouteUpdate((to, from) => {
  if (to.params.id !== from.params.id) {
    subjectId.value = to.params.id;
    fetchSubject();
  }
});
</script>

<template lang="pug">
app-loader(:is-visible="loadingSubjects || loading")

page-confirm-dialog(ref="confirmDialog")

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
          v-card-actions.mb-10
            v-spacer
            v-btn(
              color="light-blue"
              variant="flat"
              theme="dark"
              :to="{ name: 'subject-create-course', params: { subjectId: subjectId }}"
            ).text-none Add a course
          courses-list-table(
            component="v-data-table"
            :items="subject.courses || []"
            hide-subject-column
            @click:row="editCourse"
            @action="onAction"
          )
</template>
