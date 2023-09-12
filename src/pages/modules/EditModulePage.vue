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

// ROUTER
const router = useRouter();
const route: RouteWithCustomProperties = useRoute();

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

// AUTH
const authStore = useAuth();

// HEADER
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

// MODULE OPERATIONS
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
  await modulesStore.fetchModule({
    id: moduleId.value,
  });

  mod.value = { ...currentModule.value };
  modContent.value = { ...currentModuleContent.value };
}

async function updateModule() {
  await modulesStore.updateModule({
    id: moduleId.value,
    data: mod.value,
  });
}

// MODULE CONTENT OPERATIONS
const contentsStore = useContents();

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
    await contentsStore.updateContent({
      id: contentId,
      data: {
        content: modContent.value.content,
        isPublished: mod.value.isPublished,
      },
    });
  }
}

// COURSE
const coursesStore = useCourses();
const { currentCourse }: { currentCourse: Ref } = storeToRefs(coursesStore);
const courseId = ref(route.params?.courseId);

// SUBJECT
const subjectsStore = useSubjects();
const { currentSubject }: { currentSubject: Ref } = storeToRefs(subjectsStore);
const subjectId = ref(route.params?.subjectId);

// FORM HANDLER
const form: Ref = ref(null);
function submitForm() {
  form.value.submit();
}

// General operations
async function update() {
  await Promise.all([updateModule(), updateModuleContent()]);

  redirect();
}

// HOOKS
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
