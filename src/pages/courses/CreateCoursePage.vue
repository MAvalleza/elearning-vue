<script setup>
import { ref } from 'vue';
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
  description: null,
  icon: null,
});

// Flag if redirected from subject form
const isFromSubject = ref(route.meta.from === 'subject');

async function createCourse() {
  const data = {
    ...newCourse.value,
    authorId: currentUser.value.id,
  };

  // If created through subject form
  if (isFromSubject.value) {
    data.subjectId = route.params.subjectId;
  }

  await coursesStore.createCourse(data);

  router.push({
    name: isFromSubject.value ? 'edit-subject' : 'courses-list',
    ...isFromSubject.value && { params: { subjectId: route.params.subjectId } },
  });
}

const form = ref(null);
function submitForm() {
  form.value.submit();
}

// Subject
const subjectsStore = useSubjects();
const { currentSubject } = storeToRefs(subjectsStore);
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
    :subject="isFromSubject"
    @submit="createCourse"
  )
</template>
