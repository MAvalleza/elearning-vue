<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { useSubjects } from '@/stores/subjects';
import { useCourses } from '@/stores/courses';
import { useUI } from '@/stores/ui';
import { useAuth } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import isEmpty from 'lodash-es/isEmpty';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import CourseForm from '@/components/courses/CourseForm.vue';

// Header
const HEADER_BUTTON_OPTS = {
  text: 'Save',
};


function definePageTitle() {
  const routeMetaTitle = route.meta.title;

  if (!isEmpty(currentSubject.value)) {
    return `${currentSubject.value.title} > ${routeMetaTitle}`;
  } else {
    return routeMetaTitle;
  }
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

// Course
const coursesStore = useCourses();
const newCourse = ref({
  title: null,
  isPublished: null,
  subject: null,
  description: null,
  icon: null,
});

async function createCourse() {
  const data = {
    ...newCourse.value,
    author: currentUser.value.id,
  };

  // If created through subject form
  if (route.params.id) {
    data.subject = route.params.id;
  }

  await coursesStore.createCourse(data);

  router.push({
    name: route.params.id ? 'edit-subject' : 'courses-list',
    ...route.params.id && { params: { id: route.params.id } },
  });
}

const form = ref(null);
function submitForm() {
  form.value.submit();
}

// Subject
const subjectsStore = useSubjects();
const { currentSubject } = storeToRefs(subjectsStore);


onMounted(() => {
  // This has a value when this page is accessed thru subject form
  const subjectId = route.params.id;

  // This guard prevents accessing the route directly
  // without going through the normal process.
  if (subjectId && currentSubject.value.id !== subjectId) {
    // We redirect them to edit page of subject instead
    router.push({ name: 'edit-subject', params: { id: subjectId } });
  }
})
</script>

<template lang="pug">
app-loader(:is-visible="loading")

page-header(
  :title="definePageTitle()"
  :button-opts="HEADER_BUTTON_OPTS"
  @click="submitForm"
)

page-content
  course-form(
    ref="form"
    v-model="newCourse"
    :subject="!!route.params.id"
    @submit="createCourse"
  )
</template>
