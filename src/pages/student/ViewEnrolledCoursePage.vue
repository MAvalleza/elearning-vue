<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useEnrollments } from '@/stores/enrollments';
import { useRoute, useRouter } from 'vue-router';
import NumberedTimeline from '@/components/commons/NumberedTimeline.vue';
import CourseModuleContent from '@/components/student/CourseModuleContent.vue';

// Route
const route = useRoute();
const router = useRouter();

// Enrollment / course
const enrollmentId: Ref = ref(route.params.enrollmentId);
const enrollmentsStore = useEnrollments();
const { currentEnrollment } = storeToRefs(enrollmentsStore);

async function fetchCourse() {
  await enrollmentsStore.fetchEnrollment(enrollmentId.value, {
    join: ['course', 'modules']
  });

  courseModules.value = currentEnrollment.value.modules;
  // TODO: Handle picking up from where it stopped
  currentCourseModule.value = { ...courseModules.value[0] };
}

// Modules
const courseModules: Ref = ref([]);
const currentCourseModule: Ref = ref({});

function redirectToEnrolledCoursesList() {
  router.push({ name: 'enrolled-courses' });
}

function initialize() {
  fetchCourse();
}

onMounted(() => {
  initialize();
});
</script>

<template lang="pug">
v-navigation-drawer(
  location="left"
  color="#F2F2F2"
  width="230"
)
  div.timeline
    numbered-timeline(
      :items="courseModules"
      title-key="title"
    )

v-toolbar(color="light-blue")
  v-btn(
    icon="mdi-arrow-left"
    color="white"
    @click="redirectToEnrolledCoursesList()"
  )
  v-toolbar-title {{ currentCourseModule.title }}

v-container.pa-12
  v-card(elevation="5" rounded="large").pa-10
    course-module-content(
      v-if="currentCourseModule?.content"
      :content="currentCourseModule.content.content"
    )
</template>

<style scoped>
.timeline {
  padding-top: 29px;
}
</style>
