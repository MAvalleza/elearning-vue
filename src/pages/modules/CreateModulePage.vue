<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { useCourses } from '@/stores/courses';
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

// Flag if redirected from course form
const isFromCourse = ref(route.meta.from === 'course');

// Course
const coursesStore = useCourses();
const { currentCourse } = storeToRefs(coursesStore);

// Header
const HEADER_BUTTON_OPTS = {
  text: 'Save',
};

function definePageTitle() {
  const routeMetaTitle = route.meta.title;
  if (isFromCourse.value) {
    return `${currentCourse.value.title} > ${routeMetaTitle}`;
  } else {
    return routeMetaTitle;
  }
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
  isPublished: null,
  duration: null,
});


async function createModule() {
  const data = {
    ...newModule.value,
    authorId: currentUser.value.id,
  };

  // If created through course form
  if (isFromCourse.value) {
    data.courseId = route.params.courseId;
  }

  await modulesStore.createModule(data);

  router.push({
    name: isFromCourse.value ? 'edit-course' : 'modules-list',
    ...(isFromCourse.value && {
      params: { courseId: route.params.courseId },
    }),
  });
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
    :course="isFromCourse"
    @submit="createModule"
  )
</template>