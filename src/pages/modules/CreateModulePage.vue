<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { useCourses } from '@/stores/courses';
import { useSubjects } from '@/stores/subjects';
import { useModules } from '@/stores/modules';
import { useUI } from '@/stores/ui';
import { useAuth } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import ModuleForm from '@/components/modules/ModuleForm.vue';

// Router
const route = useRoute();
const router = useRouter();

// Flag if redirected from course form or subject form
const isCourseProvided = ref(['course', 'subject'].includes(route.meta.from));

// Course
const coursesStore = useCourses();
const { currentCourse } = storeToRefs(coursesStore);

// Subject
const subjectsStore = useSubjects();
const { currentSubject } = storeToRefs(subjectsStore);

// Header
const HEADER_BUTTON_OPTS = {
  text: 'Save',
};

function definePageTitle() {
  const routeMetaTitle = route.meta.title;
  const sourceRoute = route.meta.from

  const TITLE_MAPPING = {
    course: `${currentCourse.value.title} > ${routeMetaTitle}`,
    subject: `${currentSubject.value.title} > ${currentCourse.value.title} > ${routeMetaTitle}`
  };

  return TITLE_MAPPING[sourceRoute] || routeMetaTitle;
}

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
  isPublished: false,
  duration: null,
});

async function createModule() {
  const data = {
    ...newModule.value,
    authorId: currentUser.value.id,
  };

  // If created through course/subject form
  if (isCourseProvided.value) {
    data.courseId = route.params.courseId;
  }

  await modulesStore.createModule(data);

  // Redirect
  redirect()
}

function redirect() {
  const ROUTER_DATA = {
    course: {
      name: 'edit-course',
      params: { courseId: route.params.courseId },
    },
    subject: {
      name: 'subject-edit-course',
      params: {
        subjectId: route.params.subjectId,
        courseId: route.params.courseId,
      },
    }
  };

  router.push(ROUTER_DATA[route.meta.from] || { name: 'modules-list' });
}

const form = ref(null);
function submitForm() {
  form.value.submit();
}
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
    :hide-course-field="isCourseProvided"
    @submit="createModule"
  )
</template>
