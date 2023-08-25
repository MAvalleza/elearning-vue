<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useEnrollments } from '@/stores/enrollments';
import { useRoute, useRouter } from 'vue-router';

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
}

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

v-toolbar(color="light-blue")
  v-btn(
    icon="mdi-arrow-left"
    color="white"
    @click="redirectToEnrolledCoursesList()"
  )

v-container
  v-card
    pre {{ currentEnrollment }}
</template>
