<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useEnrollments } from '@/stores/enrollments';
import { useContents } from '@/stores/contents';
import { useRoute, useRouter } from 'vue-router';
import AppLoader from '@/components/commons/AppLoader.vue';
import NumberedTimeline from '@/components/commons/NumberedTimeline.vue';
import CourseModuleContent from '@/components/student/CourseModuleContent.vue';

// Route
const route = useRoute();
const router = useRouter();

// UI state
const loading = ref(false);

// Enrollment / course
const enrollmentId: Ref = ref(route.params.enrollmentId);
const enrollmentsStore = useEnrollments();
const { currentEnrollment } = storeToRefs(enrollmentsStore);

async function fetchCourse() {
  await enrollmentsStore.fetchEnrollment(enrollmentId.value, {
    join: ['course', 'modules']
  });

  courseModules.value = currentEnrollment.value.modules.map((mod, index) => ({
    index,
    ...mod,
  }));
  // TODO: Handle picking up from where it stopped
  currentCourseModule.value = { ...courseModules.value[0] };
}

// Modules
const courseModules: Ref = ref([]);
const currentCourseModule: Ref = ref({});

async function redirectToModule(index: number) {
  loading.value = true;
  currentCourseModule.value = { ...courseModules.value[index] };

  await fetchModuleContent();

  loading.value = false;
}

// Content
const moduleContent: Ref = ref({});
const contentsStore = useContents();

async function fetchModuleContent() {
  console.log('module', currentCourseModule.value.id);
  const contents = await contentsStore.fetchContents({ module: currentCourseModule.value.id });

  console.log('contents', contents);
  moduleContent.value = contents[0];
}

function redirectToEnrolledCoursesList() {
  router.push({ name: 'enrolled-courses' });
}

async function initialize() {
  loading.value = true;
  await fetchCourse();
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
  @click="redirectToModule(currentCourseModule.index + 1)"
).ma-10
</template>

<style scoped>
.timeline {
  padding-top: 29px;
}
</style>
