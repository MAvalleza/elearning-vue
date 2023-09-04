<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { useSubjects } from '@/stores/subjects';
import { useCourses } from '@/stores/courses';
import { useAuth } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import isEmpty from 'lodash-es/isEmpty';
import { type RouteWithCustomProperties } from '@/types/vue-router';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import CourseForm from '@/components/courses/CourseForm.vue';

// HEADER
const HEADER_BUTTON_OPTS = {
  text: 'Save',
};

function definePageTitle() {
  const routeMetaTitle = route.meta?.title || 'Add a course';

  if (!isEmpty(currentSubject.value)) {
    return `${currentSubject.value.title} > ${routeMetaTitle}`;
  } else {
    return routeMetaTitle;
  }
}

// ROUTER
const route: RouteWithCustomProperties = useRoute();
const router = useRouter();

// aUTH
const authStore = useAuth();
const { currentUser }: { currentUser: Ref } = storeToRefs(authStore);

// SUBJECT
const subjectsStore = useSubjects();
const { currentSubject }: { currentSubject: Ref } = storeToRefs(subjectsStore);

// COURSE OPERATIONS
const coursesStore = useCourses();
const { loadingCourses } = storeToRefs(coursesStore);
const newCourse: Ref = ref({
  title: null,
  isPublished: false,
  description: null,
  icon: null,
});

// Flag if redirected from subject form
const isFromSubject = ref(route.meta?.from === 'subject');

async function createCourse() {
  const data = {
    ...newCourse.value,
    authorId: currentUser.value.id,
  };

  // If created through subject form
  if (isFromSubject.value) {
    data.subjectId = route.params?.subjectId;
  }

  await coursesStore.createCourse(data);

  router.push({
    name: isFromSubject.value ? 'edit-subject' : 'courses-list',
    ...(isFromSubject.value && {
      params: { subjectId: route.params?.subjectId },
    }),
  });
}

// FORM HANDLER
const form: Ref = ref(null);
function submitForm() {
  form.value.submit();
}
</script>

<template lang="pug">
app-loader(:is-visible="loadingCourses")

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
