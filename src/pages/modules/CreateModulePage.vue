<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
// import { useSubjects } from '@/stores/subjects';
// import { useCourses } from '@/stores/courses';
import { useModules } from '@/stores/modules';
import { useUI } from '@/stores/ui';
import { useAuth } from '@/stores/auth';
import { storeToRefs } from 'pinia';
// import isEmpty from 'lodash-es/isEmpty';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import ModuleForm from '@/components/modules/ModuleForm.vue';

// Header
const HEADER_BUTTON_OPTS = {
  text: 'Save',
};

function definePageTitle() {
  const routeMetaTitle = route.meta.title;

  return routeMetaTitle;
  // if (!isEmpty(currentSubject.value)) {
  //   return `${currentSubject.value.title} > ${routeMetaTitle}`;
  // } else {
  //   return routeMetaTitle;
  // }
}

// Router
const route = useRoute();
const router = useRouter();

// UI State
const uiStore = useUI();
const { loading } = storeToRefs(uiStore);

// Auth
const authStore = useAuth();
const { currentUser } = storeToRefs(authStore);

// Module
const modulesStore = useModules();
const newModule = ref({
  title: null,
  isPublished: null,
  duration: null,
});

// Flag if redirected from subject form
// const isFromSubject = ref(route.meta.from === 'subject');

async function createModule() {
  const data = {
    ...newModule.value,
    authorId: currentUser.value.id,
  };

  // If created through subject form
  // if (isFromSubject.value) {
  //   data.subjectId = route.params.subjectId;
  // }

  await modulesStore.createModule(data);

  router.push({
    name: 'modules-list',
  });
}

const form = ref(null);
function submitForm() {
  form.value.submit();
}

// Subject
// const subjectsStore = useSubjects();
// const { currentSubject } = storeToRefs(subjectsStore);
</script>

<template lang="pug">
app-loader(:is-visible="loading")

page-header(
  :title="definePageTitle()"
  :button-opts="HEADER_BUTTON_OPTS"
  @click="submitForm"
)

page-content
  module-form(
    ref="form"
    v-model="newModule"
    @submit="createModule"
  )
</template>
