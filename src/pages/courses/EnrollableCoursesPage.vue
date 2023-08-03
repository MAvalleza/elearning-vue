<script setup lang="ts">
import { reactive, onMounted, type Ref } from 'vue';
import { useCourses } from '@/stores/courses'
import PageHeader from '@/components/commons/PageHeader.vue';
import CourseCard from '@/components/courses/CourseCard.vue';
import { storeToRefs } from 'pinia';

// Course
const coursesStore = useCourses();
const { courses }: { courses: Ref } = storeToRefs(coursesStore);

async function fetchCourses() {
  await coursesStore.fetchCourses(fetchParams);
}

// Fetch params
const initial = {
  params: {
    page: 1,
    limit: 25,
    keyword: null,
    published: true,
    subjectId: null,
    join: ['modules', 'subject', 'author'],
  },
  total: {
    current: 0,
    overall: 0,
  },
};

let fetchParams = reactive({ ...initial.params });

function initialize() {
  coursesStore.$reset();
  fetchParams = reactive({ ...initial.params });
  fetchCourses();
}


onMounted(() => {
  initialize();
})
</script>

<template lang="pug">
page-header
  template(#content)
    v-container(fluid)
      v-row(align="center" justify="center")
        v-col(cols="12" lg="8").text-center
          h1 Welcome to the eLearning portal
          p Our course will step you through the process of building a small application, or adding a new feature to an existing application
// Content
v-container(fluid)
  v-row
    // Course cards
    v-col(
      v-for="(course, key) in courses"
      :key="key"
      cols="12"
      lg="4"
    )
      course-card(:course="course")
</template>