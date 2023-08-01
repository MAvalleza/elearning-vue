<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCourses } from '@/stores/courses';
import { useSubjects } from '@/stores/subjects';
import { useModules } from '@/stores/modules';
import { useUI } from '@/stores/ui';
import { useAuth } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { type RouteWithCustomProperties } from '@/types/vue-router';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import ModuleForm from '@/components/modules/ModuleForm.vue';

// Router
const route: RouteWithCustomProperties = useRoute();
const router = useRouter();

// Flag if redirected from course form or subject form
const SOURCE_ROUTES = ['course', 'subject'];
const isCourseProvided = ref(route.meta?.from && SOURCE_ROUTES.includes(route.meta.from));

// Course
const coursesStore = useCourses();
const { currentCourse }: { currentCourse: Ref } = storeToRefs(coursesStore);

// Subject
const subjectsStore = useSubjects();
const { currentSubject }: { currentSubject: Ref } = storeToRefs(subjectsStore);

// Header
const HEADER_BUTTON_OPTS = {
  text: 'Save',
};

function definePageTitle() {
  const routeMetaTitle = route.meta?.title;
  const sourceRoute = route.meta?.from

  const TITLE_MAPPING = {
    course: `${currentCourse.value.title} > ${routeMetaTitle}`,
    subject: `${currentSubject.value.title} > ${currentCourse.value.title} > ${routeMetaTitle}`
  };

  if (sourceRoute) {
    return TITLE_MAPPING[sourceRoute as keyof typeof TITLE_MAPPING]
  }

  return routeMetaTitle;
}

// UI State
const uiStore = useUI();
const { loading } = storeToRefs(uiStore);

// Auth
const authStore = useAuth();
const { currentUser }: { currentUser: Ref } = storeToRefs(authStore);

// Module
const modulesStore = useModules();
const newModule = ref({
  title: null,
  isPublished: false,
  duration: null,
  content: null
});

// Content
const newContent = ref({ content: null });

async function createModule() {
  const data: {
    authorId: string,
    courseId?: string,
    content?: typeof newContent.value.content
  } | typeof newModule.value = {
    ...newModule.value,
    authorId: currentUser.value.id,
    content: newContent.value.content,
  };

  // If created through course/subject form
  if (isCourseProvided.value) {
    data.courseId = route.params?.courseId;
  }

  await modulesStore.createModule(data);

  // Redirect
  redirect();
}

function redirect() {
  const ROUTER_DATA = {
    course: {
      name: 'edit-course',
      params: { courseId: route.params?.courseId },
    },
    subject: {
      name: 'subject-edit-course',
      params: {
        subjectId: route.params?.subjectId,
        courseId: route.params?.courseId,
      },
    }
  };

  if (route.meta?.from) {
    router.push(ROUTER_DATA[route.meta.from as keyof typeof ROUTER_DATA])
  } else {
    router.push({ name: 'modules-list' });
  }
}

const form: Ref = ref(null);
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
    v-model:content="newContent"
    :hide-course-field="isCourseProvided"
    @submit="createModule"
  )
</template>
