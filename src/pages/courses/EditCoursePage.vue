<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { useSubjects } from '@/stores/subjects';
import { useCourses } from '@/stores/courses';
import { useAuth } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { type GenericTableItem } from '@/types/data-table';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import CourseForm from '@/components/courses/CourseForm.vue';
import ModulesListTable from '@/components/modules/ModulesListTable.vue';

// Header
const HEADER_BUTTON_OPTS = {
  text: 'Save',
};

function definePageTitle() {
  if (isFromSubject.value) {
    return `${currentSubject.value.title} > ${currentCourse.value.title}`;
  } else {
    return currentCourse.value.title;
  }
}

const tab = ref('form');

// Router
const router = useRouter();
const route = useRoute();

// Auth
const authStore = useAuth();

// Course
const coursesStore = useCourses();
const { currentCourse, loadingCourses }: { currentCourse: Ref; loadingCourses: Ref } = storeToRefs(coursesStore);
const course = ref({});
const courseId: Ref = ref(route.params.courseId);

async function updateCourse() {
  await coursesStore.updateCourse(courseId.value, course.value);

  router.push({
    name: isFromSubject.value ? 'edit-subject' : 'courses-list',
    ...(isFromSubject.value && {
      params: { subjectId: route.params.subjectId },
    }),
  });
}

// Subject
const subjectsStore = useSubjects();
const { currentSubject }: { currentSubject: Ref } = storeToRefs(subjectsStore);
const subjectId = ref(route.params.subjectId);

// Flag for knowing if accessed from subject form
const isFromSubject = ref(route.meta.from === 'subject');

async function fetchCourse() {
  await coursesStore.fetchCourse(courseId.value, {
    join: ['modules'],
  });

  course.value = { ...currentCourse.value };
}

// Form operations
const form: Ref = ref(null);
function submitForm() {
  form.value.submit();
}

// Module
const SUBJECT_MODULE_ROUTE_MAPPINGS = {
  createRoute: 'subject-create-module',
  editRoute: 'subject-edit-module',
  params: {
    subjectId: subjectId.value,
    courseId: courseId.value,
  },
};

function editModule(_event: Event, { item }: GenericTableItem) {
  if (isFromSubject.value) {
    router.push({
      name: SUBJECT_MODULE_ROUTE_MAPPINGS.editRoute,
      params: {
        ...SUBJECT_MODULE_ROUTE_MAPPINGS.params,
        moduleId: item.raw.id,
      },
    });
  } else {
    router.push({
      name: 'course-edit-module',
      params: {
        courseId: courseId.value,
        moduleId: item.raw.id,
      },
    });
  }
}

function defineCreateModuleRoute() {
  if (isFromSubject.value) {
    return {
      name: SUBJECT_MODULE_ROUTE_MAPPINGS.createRoute,
      params: SUBJECT_MODULE_ROUTE_MAPPINGS.params,
    };
  } else {
    return {
      name: 'course-create-module',
      params: { courseId: courseId.value },
    };
  }
}

onMounted(() => {
  fetchCourse();
});

onBeforeRouteUpdate((to, from) => {
  if (to.params.courseId !== from.params.courseId) {
    courseId.value = to.params.courseId;
    fetchCourse();
  }
});
</script>

<template lang="pug">
app-loader(:is-visible="loadingCourses")

page-header(
  :title="definePageTitle()"
  :button-opts="HEADER_BUTTON_OPTS"
  :hide-button="!authStore.isInstructor"
  @click="submitForm"
)

page-content
  v-card
    v-tabs(v-model="tab")
      v-tab(value="form" width="116").text-none Course
      v-tab(value="modules" width="116").text-none Modules

    v-window(v-model="tab").pt-10
      v-window-item(value="form")
        course-form(
          ref="form"
          :key="course.id"
          v-model="course"
          :loading="loadingCourses"
          :subject="isFromSubject"
          :disabled="!authStore.isInstructor"
          @submit="updateCourse"
        )
      v-window-item(value="modules")
        v-card
          v-card-actions.mb-10
            v-spacer
            v-btn(
              v-if="authStore.isInstructor"
              color="light-blue"
              variant="flat"
              theme="dark"
              size="large"
              :to="defineCreateModuleRoute()"
            ).text-none Add a module
          modules-list-table(
            component="v-data-table"
            :loading="loadingCourses"
            :items="course.modules || []"
            :disabled="!authStore.isInstructor"
            hide-course-column
            @click:row="editModule"
          )
</template>
