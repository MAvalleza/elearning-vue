<script setup lang="ts">
import { ref } from 'vue';
// import { useCourses } from '@/stores/c'
import PageHeader from '@/components/commons/PageHeader.vue';
import CourseCard from '@/components/courses/CourseCard.vue';

// TODO: Supply data
const courses = ref([
  {
    title: 'Sample',
    isPublished: true,
    subject: { title: 'Sample subject' }
  },
  {
    title: 'Sample',
    isPublished: true,
    subject: { title: 'Sample subject' }
  },
  {
    title: 'Sample',
    isPublished: true,
    subject: { title: 'Sample subject' }
  },
])
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