<script setup lang="ts">
import { reactive, onMounted, ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import debounce from 'lodash-es/debounce';
import isEmpty from 'lodash-es/isEmpty';
import { type Course } from '@/types/course';
import { useCourses } from '@/stores/courses';
import { useUI } from '@/stores/ui';
import PageHeader from '@/components/commons/PageHeader.vue';
import CourseCard from '@/components/courses/CourseCard.vue';
import CourseInformationDialog from '@/components/courses/CourseInformationDialog.vue';
import SubjectSearch from '@/components/commons/SubjectSearch.vue';
import InstructorSearch from '@/components/commons/InstructorSearch.vue';

// UI
const uiStore = useUI();
const { loading } = storeToRefs(uiStore);

const infoDialog: Ref = ref(null);

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
    authorId: null,
    join: ['modules', 'subject', 'author'],
  },
  total: {
    current: 0,
    overall: 0,
  },
  subjectParams: { published: true }
};

let fetchParams = reactive({ ...initial.params });

// Search
const onSearch = debounce(() => fetchCourses(), 1000);

// View course
async function onCourseSelect(selectedCourse: Course) {
  await infoDialog.value.open(selectedCourse);
}

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
course-information-dialog(ref="infoDialog")

page-header
  template(#content)
    v-container(fluid)
      v-row(align="center" justify="center")
        v-col(cols="12" lg="8").text-center
          h1 Welcome to the eLearning portal
          p Our course will step you through the process of building a small application, or adding a new feature to an existing application
// Content
// TODO: Create pagination
v-container(fluid)
  v-row
    // Search bar
    v-col
      v-text-field(
        v-model="fetchParams.keyword"
        variant="outlined"
        label="Search for a course"
        placeholder="Enter a keyword"
        @update:model-value="onSearch"
      )
    v-spacer
    // Subject search
    v-col
      subject-search(
        v-model="fetchParams.subjectId"
        @update:model-value="onSearch"
      )
    // Instructor search
    v-col
      instructor-search(
        v-model="fetchParams.authorId"
        @update:model-value="onSearch"
      )
  v-row(v-if="loading" justify="center")
    v-col.text-center
      v-progress-circular(indeterminate color="light-blue")
  v-row(v-else-if="isEmpty(courses)")
    v-col.text-center
      h2 No courses available
  v-row(v-else)
    // Course cards
    v-col(
      v-for="(course, key) in courses"
      :key="key"
      cols="12"
      lg="4"
    )
      course-card(:course="course" @click="onCourseSelect(course)")
</template>