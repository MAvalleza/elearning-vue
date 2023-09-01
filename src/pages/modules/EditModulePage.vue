<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { useModules } from '@/stores/modules';
import { useContents } from '@/stores/contents';
import { useCourses } from '@/stores/courses';
import { useSubjects } from '@/stores/subjects';
import { useAuth } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { type RouteWithCustomProperties } from '@/types/vue-router';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import ModuleForm from '@/components/modules/ModuleForm.vue';

// Router
const router = useRouter();
const route: RouteWithCustomProperties = useRoute();

// Auth
const authStore = useAuth();

// Header
const HEADER_BUTTON_OPTS = {
  text: 'Save',
};

function definePageTitle() {
  return [
    !!subjectId.value && currentSubject.value.title,
    !!courseId.value && currentCourse.value.title,
    currentModule.value.title,
  ]
    .filter(Boolean)
    .join(' > ');
}


// Module
const modulesStore = useModules();
const {
  currentModule,
  currentModuleContent,
  loadingModules,
}: { currentModule: Ref; currentModuleContent: Ref; loadingModules: Ref } =
  storeToRefs(modulesStore);
const moduleId: Ref = ref(route.params?.moduleId);
const mod: Ref = ref({});
const modContent = ref({ content: {} });

async function fetchModule() {
  await modulesStore.fetchModule(moduleId.value);

  mod.value = { ...currentModule.value };
  modContent.value = { ...currentModuleContent.value };
}

// Module Content
const contentsStore = useContents();

async function updateModule() {
  await modulesStore.updateModule(moduleId.value, mod.value);
}

async function updateModuleContent() {
  const contentId = currentModuleContent.value.id;

  // Create content if does not exist
  if (!contentId) {
    await contentsStore.createContent({
      content: modContent.value.content,
      type: 'document',
      moduleId: moduleId.value,
      isPublished: mod.value.isPublished,
    });
  } else {
    await contentsStore.updateContent(contentId, {
      content: modContent.value.content,
      isPublished: mod.value.isPublished
    });
  }
}

// Course
const coursesStore = useCourses();
const { currentCourse }: { currentCourse: Ref } = storeToRefs(coursesStore);
const courseId = ref(route.params?.courseId);

// Subject
const subjectsStore = useSubjects();
const { currentSubject }: { currentSubject: Ref } = storeToRefs(subjectsStore);
const subjectId = ref(route.params?.subjectId);

// Form operations
const form: Ref = ref(null);
function submitForm() {
  form.value.submit();
}

// General operations
async function update() {
  await Promise.all([updateModule(), updateModuleContent()]);

  redirect();
}

function redirect() {
  // Route data mappings according to source route
  const sourceRoute = route.meta?.from;

  const ROUTE_MAPPINGS = {
    course: {
      name: 'edit-course',
      params: { courseId: courseId.value },
    },
    subject: {
      name: 'subject-edit-course',
      params: {
        courseId: courseId.value,
        subjectId: subjectId.value,
      },
    },
  };

  if (sourceRoute) {
    router.push(ROUTE_MAPPINGS[sourceRoute as keyof typeof ROUTE_MAPPINGS]);
  } else {
    router.push({ name: 'modules-list' });
  }
}

onMounted(() => {
  fetchModule();
});

onBeforeRouteUpdate((to, from) => {
  if (to.params.moduleId !== from.params.moduleId) {
    moduleId.value = to.params.moduleId;
    fetchModule();
  }
});
</script>

<template lang="pug">
app-loader(:is-visible="loadingModules")

page-header(
  :title="definePageTitle()"
  :button-opts="HEADER_BUTTON_OPTS"
  :hide-button="!authStore.isInstructor"
  @click="submitForm"
)

page-content
  module-form(
    ref="form"
    :key="mod.id"
    v-model="mod"
    v-model:content="modContent"
    :hide-course-field="isCourseProvided"
    :loading="loadingModules"
    :disabled="!authStore.isInstructor"
    @submit="update"
  )
</template>
