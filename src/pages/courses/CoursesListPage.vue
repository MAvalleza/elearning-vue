<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted, reactive, ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import uniqBy from 'lodash-es/uniqBy';
import { useCourses } from '@/stores/courses';
import { useAuth } from '@/stores/auth';
import { mapOptionsToParams } from '@/helpers/tableHelper';
import type {
  GenericTableItem,
  TableOptions,
  TableActionOpt,
} from '@/types/data-table';
import type { FetchCoursesParams, MappedCourse } from '@/types/course';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import PageConfirmDialog from '@/components/commons/ConfirmDialog.vue';
import SearchAndFilter from '@/components/commons/SearchAndFilter.vue';
import CoursesListTable from '@/components/courses/CoursesListTable.vue';

// ROUTER
const router = useRouter();
const route = useRoute();

// Auth
const authStore = useAuth();

// UI states
const HEADER_BUTTON_OPTS = {
  text: 'ADD NEW COURSE',
  flat: true,
  style: { color: 'black' },
  to: { name: 'create-course' },
};

const confirmDialog: Ref = ref(null);

// FETCH PARAMS
const initial = {
  params: {
    page: 1,
    limit: 25,
    join: ['modules', 'subject', 'author'],
  },
  total: {
    current: 0,
    overall: 0,
  },
};

let fetchParams = reactive({ ...initial.params } as FetchCoursesParams);

// COURSE OPERATIONS
const coursesStore = useCourses();
const {
  courses,
  coursesTotal,
  loadingCourses,
}: { courses: Ref; coursesTotal: Ref; loadingCourses: Ref } =
  storeToRefs(coursesStore);

async function fetchCourses() {
  await coursesStore.fetchCourses(fetchParams);

  updateSubjectFilterOptions();
}

async function deleteCourse(id: string) {
  const confirm = await confirmDialog.value.open({
    title: 'Delete Course',
    message:
      'Deleting a course will also delete its modules, are you sure you want to delete this course?',
    primaryAction: 'DELETE',
    primaryColor: 'error',
  });

  if (confirm) {
    await coursesStore.deleteCourse(id);

    fetchCourses();
  }
}

// FILTER OPERATIONS
const subjectFilterOptions: Ref = ref([]);

function updateSubjectFilterOptions() {
  subjectFilterOptions.value = uniqBy(
    courses.value.map((course: MappedCourse) => course.subject),
    'id'
  );
}

function onClearFilter() {
  fetchParams.subjectId = null;

  fetchCourses();
}

// TABLE OPERATIONS

function editCourse(_event: Event, { item }: GenericTableItem) {
  router.push({
    name: 'edit-course',
    params: { courseId: item.raw.id },
  });
}

function onUpdateTableOptions(options: TableOptions) {
  // We update the fetch Params before invoking fetch request
  const updatedParams = mapOptionsToParams(options);

  fetchParams = reactive({
    ...initial.params,
    ...updatedParams,
  });

  fetchCourses();
}

async function onAction({ action, item }: TableActionOpt) {
  const id = item.raw.id;
  const result = await coursesStore.onTableAction({ id, action });

  if (result?.delete) {
    await deleteCourse(id);
  } else {
    // Re-fetch courses
    fetchCourses();
  }
}

// INITIALIZATIONS
function initialize() {
  coursesStore.$reset();
  fetchParams = reactive({ ...initial.params });
}

onMounted(() => {
  initialize();
});
</script>

<template lang="pug">
page-confirm-dialog(ref="confirmDialog")

page-header(
  :title="route.meta.title"
  :button-opts="HEADER_BUTTON_OPTS"
  :hide-button="!authStore.isInstructor"
  has-center-section
)
  template(#center-section)
    search-and-filter(
      v-model:search-text="fetchParams.keyword"
      v-model:status-filter="fetchParams.published"
      @search="fetchCourses"
      @filter="fetchCourses"
      @clear:filter="onClearFilter"
    )
      template(#additional-filter)
        v-select(
          v-model="fetchParams.subjectId"
          label="Subject"
          variant="outlined"
          density="comfortable"
          :items="subjectFilterOptions"
          item-value="id"
        )
page-content
  courses-list-table(
    v-model:items-per-page="fetchParams.limit"
    :items="courses"
    :items-length="coursesTotal"
    :loading="loadingCourses"
    :disabled="!authStore.isInstructor"
    @click:row="editCourse"
    @update:options="onUpdateTableOptions"
    @action="onAction"
  )
</template>
