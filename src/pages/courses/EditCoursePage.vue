<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { useSubjects } from '@/stores/subjects';
import { useCourses } from '@/stores/courses';
import { useUI } from '@/stores/ui';
import { storeToRefs } from 'pinia';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import CourseForm from '@/components/courses/CourseForm.vue';

// Header
const HEADER_BUTTON_OPTS = {
  text: 'Save',
};

function definePageTitle() {
  if (fromSubject.value) {
    return `${currentSubject.value.title} > ${currentCourse.value.title}`;
  } else {
    return currentCourse.value.title;
  }
}

const router = useRouter();
const route = useRoute();

const uiStore = useUI();
const { loading } = storeToRefs(uiStore);

const coursesStore = useCourses();
const { currentCourse } = storeToRefs(coursesStore);
const course = ref({});
const courseId = ref(route.params.courseId);

const subjectsStore = useSubjects();
const { currentSubject } = storeToRefs(subjectsStore);

// Flag for knowing if accessed from subject form
const fromSubject = ref(route.meta.from === 'subject');

async function fetchCourse() {
  await coursesStore.fetchCourse(courseId.value, {
    join: ['modules'],
  });

  course.value = { ...currentCourse.value };
}

const form = ref(null);
function submitForm() {
  form.value.submit();
}

async function updateCourse() {
  await coursesStore.updateCourse(courseId.value, course.value);

  router.push({
    name: fromSubject.value ? 'edit-subject' : 'courses-list',
    ...fromSubject.value && { params: { subjectId: route.params.subjectId } },
  });
}

const tab = ref('form');

onMounted(() => {
  fetchCourse();
});

onBeforeRouteUpdate((to, from) => {
  if (to.params.id !== from.params.id) {
    courseId.value = to.params.id;
    fetchCourse();
  }
});
</script>

<template lang="pug">
app-loader(:is-visible="loading")

page-header(
  :title="definePageTitle()"
  :button-opts="HEADER_BUTTON_OPTS"
  @click="submitForm"
)

page-content
  v-card
    v-tabs(v-model="tab")
      v-tab(value="form") Course
      v-tab(value="courses") Modules

    v-window(v-model="tab").pt-10
      v-window-item(value="form")
        course-form(
          ref="form"
          :key="course.id"
          v-model="course"
          :loading="loading"
          :subject="fromSubject"
          @submit="updateCourse"
        )
      v-window-item(value="courses")
</template>
