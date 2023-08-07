<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuth } from '@/stores/auth';
import { useEnrollments } from '@/stores/enrollments';
import CourseCard from '@/components/courses/CourseCard.vue';

// Auth
const authStore = useAuth();
const { currentUser } = storeToRefs(authStore);

// Enrollments
const enrollmentsStore = useEnrollments();
const { enrollments, loadingEnrollments } = storeToRefs(enrollmentsStore);

async function fetchEnrollments() {
  await enrollmentsStore.fetchEnrollments(fetchParams);
}

// Fetch params
const initial = {
  params: {
    page: 1,
    limit: 25,
    studentId: currentUser.value.id,
    join: ['course', 'author', 'subject', 'modules'],
  },
};

let fetchParams = reactive({ ...initial.params });

function initialize() {
  enrollmentsStore.$reset();
  fetchParams = reactive({ ...initial.params });

  fetchEnrollments();
}

onMounted(() => {
  initialize();
});
</script>

<template lang="pug">
v-container(fluid)
  h4.text-h4.text-light-blue Current Lesson
  h4.text-h4.text-light-blue My Courses

  v-row(v-if="loadingEnrollments" justify="center")
    v-col.text-center
      v-progress-circular(indeterminate color="light-blue")
  v-row(v-else).mt-5
    // Course cards
    v-col(
      v-for="(enrollment, key) in enrollments"
      :key="key"
      cols="12"
      lg="4"
    )
      course-card(
        :course="enrollment.course"
      )
        template(#action-btn)
          v-btn(block color="light-blue") START
</template>
