<script setup lang="ts">
import { onMounted, reactive, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import isEmpty from 'lodash-es/isEmpty';
import { useAuth } from '@/stores/auth';
import { useEnrollments } from '@/stores/enrollments';
import { useStudent } from '@/stores/student';
import GenericContainer from '@/components/commons/GenericContainer.vue';
import CourseCard from '@/components/courses/CourseCard.vue';

// Auth
const authStore = useAuth();
const { currentUser }: { currentUser: Ref } = storeToRefs(authStore);

// Enrollments
const enrollmentsStore = useEnrollments();
const { enrollments, loadingEnrollments } = storeToRefs(enrollmentsStore);

async function fetchEnrollments() {
  await enrollmentsStore.fetchEnrollments(fetchParams);
}

// Student
const studentStore = useStudent();
const { currentLesson }: { currentLesson: Ref } = storeToRefs(studentStore);

function hasCurrentLesson() {
  return !isEmpty(currentLesson.value);
}

// Fetch params
const initial = {
  params: {
    page: 1,
    limit: 25,
    studentId: currentUser.value.id,
    join: ['course', 'author', 'subject', 'modules'],
    completed: false,
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
generic-container
  div(v-if="hasCurrentLesson()")
    h4.section-title Current Lesson

    div.d-flex
      v-img(v-if="currentLesson.course?.icon" :src="currentLesson.course?.icon" height="100")
      v-icon(v-else size="100" icon="mdi-bookshelf")
      v-icon(icon="mdi-arrow-right")
      h6.current-module {{ currentLesson.module?.title }}
  div
    h4.section-title.mb-5 My Courses

    v-row(v-if="loadingEnrollments" justify="center")
      v-col.text-center
        v-progress-circular(indeterminate color="light-blue")
    v-row(v-else-if="isEmpty(enrollments)")
      v-col
        h6.text-h6 No courses enrolled
    v-row(v-else)
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
            v-btn(
              block
              color="light-blue"
              :to="{ name: 'view-enrolled-course', params: { enrollmentId: enrollment.id } }"
            ) START
</template>

<style scoped>
.section-title {
  color: var(--accent-a-700, #1191E9);
  font-family: Montserrat;
  font-size: 34px;
  line-height: 36px;
}

.current-module {
  color: var(--on-surface-white-high-emphasis-87, rgba(0, 0, 0, 0.87));
  font-family: Montserrat;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.15px;
}
</style>
