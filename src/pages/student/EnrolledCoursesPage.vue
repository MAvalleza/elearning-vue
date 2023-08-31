<script setup lang="ts">
import { onMounted, reactive, ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import isEmpty from 'lodash-es/isEmpty';
import { useAuth } from '@/stores/auth';
import { useEnrollments } from '@/stores/enrollments';
import GenericContainer from '@/components/commons/GenericContainer.vue';
import CourseCard from '@/components/courses/CourseCard.vue';
import type { MappedEnrollment } from '@/types/enrollment';

// Auth
const authStore = useAuth();
const { currentUser }: { currentUser: Ref } = storeToRefs(authStore);

// Enrollments
const enrollmentsStore = useEnrollments();
const { enrollments, loadingEnrollments, currentEnrollment }
  : { enrollments: Ref, loadingEnrollments: Ref, currentEnrollment: Ref } = storeToRefs(enrollmentsStore);
const mappedEnrollments: Ref = ref([]);

async function fetchEnrollments() {
  await enrollmentsStore.fetchEnrollments(fetchParams);

  // Map data for the course card
  mappedEnrollments.value = enrollments.value.map((e: MappedEnrollment) => ({
    ...e,
    course: {
      ...e.course,
      subject: e.subject,
      modules: e.modules,
      author: e.author,
    }
  }));
}

function hasCurrentLesson() {
  return !isEmpty(currentEnrollment.value);
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

    // TODO: Refactor
    //- div.d-flex
    //-   v-img(v-if="currentEnrollment.course?.icon" :src="currentEnrollment.course?.icon" height="100")
    //-   v-icon(v-else size="100" icon="mdi-bookshelf")
    //-   v-icon(icon="mdi-arrow-right")
    //-   h6.current-module {{ currentEnrollment.module?.title }}
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
        v-for="(enrollment, key) in mappedEnrollments"
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
            ) {{ currentEnrollment.id === enrollment.id ? 'CONTINUE' : 'START' }}
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
