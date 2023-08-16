<script setup lang="ts">
import { reactive, onMounted, ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import debounce from 'lodash-es/debounce';
import isEmpty from 'lodash-es/isEmpty';
import { type Course } from '@/types/course';
import { useCourses } from '@/stores/courses';
import { useEnrollments } from '@/stores/enrollments';
import AppLoader from '@/components/commons/AppLoader.vue';
import PageHeader from '@/components/commons/PageHeader.vue';
import CourseCard from '@/components/courses/CourseCard.vue';
import SubjectSearch from '@/components/commons/SubjectSearch.vue';
import InstructorSearch from '@/components/commons/InstructorSearch.vue';
import PageConfirmDialog from '@/components/commons/ConfirmDialog.vue';
import CourseInformationDialog from '@/components/courses/CourseInformationDialog.vue';

// UI
const infoDialog: Ref = ref(null);
const confirmDialog: Ref = ref(null);

// Course
const coursesStore = useCourses();
const { courses, coursesTotal, loadingCourses }: { courses: Ref; coursesTotal: Ref; loadingCourses: Ref } = storeToRefs(coursesStore);

async function fetchCourses() {
  await coursesStore.fetchCourses(fetchParams);
}

// Fetch params
const initial = {
  params: {
    page: 1,
    limit: 24,
    published: true,
    join: ['modules', 'subject', 'author'],
  },
  total: {
    current: 0,
    overall: 0,
  },
  subjectParams: { published: true },
};

let fetchParams = reactive({ ...initial.params });

// Pagination
function getPaginationLength() {
  return Math.ceil(coursesTotal.value / fetchParams.limit);
}

// Search
const onParamChange = debounce(() => fetchCourses(), 1000);

// Enrollment
const enrollmentsStore = useEnrollments();
async function onEnrollCourse(course: Course) {
  const confirm = await confirmDialog.value.open({
    title: `Enroll in ${course.title}`,
    message: 'Are you sure you want to enroll in this course?',
    primaryAction: 'ENROLL',
    primaryColor: 'light-blue',
  });

  if (confirm) {
    await enrollmentsStore.createEnrollment({ courseId: course.id });
  }
}

// View course
async function onCourseSelect(selectedCourse: Course) {
  const isEnrollClicked = await infoDialog.value.open(selectedCourse);

  if (isEnrollClicked) {
    await enrollmentsStore.createEnrollment({ courseId: selectedCourse.id });
  }
}

function initialize() {
  coursesStore.$reset();
  fetchParams = reactive({ ...initial.params });
  fetchCourses();
}

onMounted(() => {
  initialize();
});
</script>

<template lang="pug">
app-loader(:is-visible="loadingCourses")

page-confirm-dialog(ref="confirmDialog")
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
        @update:model-value="onParamChange"
      )
    v-spacer
    // Subject search
    v-col
      subject-search(
        v-model="fetchParams.subjectId"
        @update:model-value="onParamChange"
      )
    // Instructor search
    v-col
      instructor-search(
        v-model="fetchParams.authorId"
        @update:model-value="onParamChange"
      )
  v-row(v-if="loadingCourses" justify="center")
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
      course-card(
        :course="course"
        @click="onCourseSelect(course)"
        @click:enroll="onEnrollCourse(course)"
      )
    v-col(cols="12")
      v-pagination(
        v-model="fetchParams.page"
        :length="getPaginationLength()"
        @update:model-value="fetchCourses"
      )
</template>
