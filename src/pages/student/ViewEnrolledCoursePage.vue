<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useEnrollments } from '@/stores/enrollments';
import { useContents } from '@/stores/contents';
import { useRoute, useRouter } from 'vue-router';
import isEmpty from 'lodash-es/isEmpty';
import AppLoader from '@/components/commons/AppLoader.vue';
import NumberedTimeline from '@/components/commons/NumberedTimeline.vue';
import CourseModuleContent from '@/components/student/CourseModuleContent.vue';
import type { Module } from '@/types/module';

// ROUTER
const route = useRoute();
const router = useRouter();

function redirectToEnrolledCoursesList() {
  router.push({ name: 'enrolled-courses' });
}

// UI STATE
const loading = ref(false);

// ENROLLMENT OPERATIONS
const enrollmentId: Ref = ref(route.params.enrollmentId);
const enrollmentsStore = useEnrollments();
const {
  currentEnrollment,
  currentLesson,
}: { currentEnrollment: Ref; currentLesson: Ref } =
  storeToRefs(enrollmentsStore);

async function fetchEnrollment() {
  await enrollmentsStore.fetchEnrollment(enrollmentId.value, {
    join: ['course', 'modules'],
  });

  // Get modules
  courseModules.value = currentEnrollment.value.modules.map(
    (mod: Module, index: number) => ({
      index,
      ...mod,
    })
  );

  // Check if there is a current lesson then assign that lesson's module as the current module
  if (!isEmpty(currentLesson.value)) {
    currentCourseModule.value = { ...currentLesson.value.module };
  } else {
    currentCourseModule.value = { ...courseModules.value[0] };

    // Set current lesson
    enrollmentsStore.setCurrentLesson({
      enrollmentId: enrollmentId.value,
      course: currentEnrollment.value.course,
      module: currentCourseModule.value,
    });
  }
}

// Update enrollment module to completed
async function updateEnrollmentProgress() {
  loading.value = true;

  await enrollmentsStore.updateEnrollment({
    id: enrollmentId.value,
    data: {
      moduleId: currentCourseModule.value.id,
      isCompleted: true,
    }
  });

  // if there is next module, we allow to proceed to next module
  if (currentCourseModule.value.index < courseModules.value.length - 1) {
    await redirectToModule(currentCourseModule.value.index + 1);
  }

  loading.value = false;
}

// MODULE OPERATIONS
const courseModules: Ref = ref([]);
const currentCourseModule: Ref = ref({});

function onModuleSelect({ index }: { index: number }) {
  redirectToModule(index);
}

async function redirectToModule(moduleIndex: number) {
  currentCourseModule.value = { ...courseModules.value[moduleIndex] };

  enrollmentsStore.setCurrentLesson({
    enrollmentId: enrollmentId.value,
    course: currentEnrollment.value.course,
    module: currentCourseModule.value,
  });

  await fetchModuleContent();
}

// MODULE CONTENT
const moduleContent: Ref = ref({});
const contentsStore = useContents();

async function fetchModuleContent() {
  const contents = await contentsStore.fetchContents({
    module: currentCourseModule.value.id,
  });

  moduleContent.value = contents[0];
}

async function finishCourse() {
  await updateEnrollmentProgress();

  // Remove current enrollment / lesson since it is done
  enrollmentsStore.clearCurrentEnrollment();

  redirectToEnrolledCoursesList();
}

// INITIALIZATIONS
async function initialize() {
  loading.value = true;

  // Check if `currentLesson` store data is the one viewed
  // Otherwise we reset the store
  if (currentLesson.value.enrollmentId !== enrollmentId.value) {
    enrollmentsStore.$reset();
  }

  await fetchEnrollment();
  await fetchModuleContent();
  loading.value = false;
}

onMounted(() => {
  initialize();
});
</script>

<template lang="pug">
app-loader(:is-visible="loading")

v-navigation-drawer(
  location="left"
  color="#F2F2F2"
  width="230"
)
  div.timeline
    numbered-timeline(
      :active-key-value="currentCourseModule.id"
      :items="courseModules"
      title-key="title"
      active-key="id"
      @select="onModuleSelect($event)"
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
      v-if="moduleContent?.content && !loading"
      :key="currentCourseModule.id"
      :content="moduleContent.content"
    )

// FAB Next
v-btn(
  v-if="currentCourseModule.index + 1 < courseModules.length"
  icon="mdi-chevron-right"
  position="fixed"
  size="large"
  location="bottom right"
  color="light-blue"
  @click="updateEnrollmentProgress"
).ma-10

v-btn(
  v-if="currentCourseModule.index === courseModules.length - 1"
  position="fixed"
  size="large"
  location="bottom right"
  color="light-blue"
  @click="finishCourse"
).ma-10 Finish
</template>

<style scoped>
.timeline {
  padding-top: 29px;
}
</style>
