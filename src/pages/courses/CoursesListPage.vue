<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted, reactive, ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import uniqBy from 'lodash-es/uniqBy';
import { useCourses } from '@/stores/courses';
import { useUI } from '@/stores/ui';
import { mapOptionsToParams } from '@/helpers/tableHelper';
import {
  type GenericTableItem,
  type TableOptions,
  type TableActionOpt,
} from '@/types/data-table';
import { type Course } from '@/types/course';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import PageConfirmDialog from '@/components/commons/ConfirmDialog.vue';
import SearchAndFilter from '@/components/commons/SearchAndFilter.vue';
import CoursesListTable from '@/components/courses/CoursesListTable.vue';

const router = useRouter();
const route = useRoute();

const HEADER_BUTTON_OPTS = {
  text: 'ADD NEW COURSE',
  flat: true,
  style: { color: 'black' },
  to: { name: 'create-course' },
};

// UI states
const uiStore = useUI();
const { loading } = storeToRefs(uiStore);
const confirmDialog: Ref = ref(null);

const coursesStore = useCourses();
const { courses, coursesTotal }: { courses: Ref; coursesTotal: Ref } =
  storeToRefs(coursesStore);

// Fetch params
const initial = {
  params: {
    page: 1,
    limit: 25,
    sort: null,
    sortDirection: null,
    keyword: null,
    published: null,
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
}

async function fetchCourses() {
  await coursesStore.fetchCourses(fetchParams);

  updateSubjectFilterOptions();
}

// Filter operations
const subjectFilterOptions: Ref = ref([]);

function updateSubjectFilterOptions() {
  subjectFilterOptions.value = uniqBy(
    courses.value.map((course: Course) => course.subject),
    'id'
  );
}

function onClearFilter() {
  fetchParams.subjectId = null;

  fetchCourses();
}

function editCourse(_event: Event, { item }: GenericTableItem) {
  router.push({
    name: 'edit-course',
    params: { courseId: item.raw.id },
  });
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
  }
}

function onUpdateTableOptions(options: TableOptions) {
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

  if (result?.delete) await deleteCourse(id);

  // Re-fetch courses
  fetchCourses();
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
      template(#custom-filter)
        v-select(
          v-model="fetchParams.subjectId"
          label="Subject"
          variant="outlined"
          :items="subjectFilterOptions"
          item-value="id"
        )
page-content
  courses-list-table(
    v-model:items-per-page="fetchParams.limit"
    :items="courses"
    :items-length="coursesTotal"
    :loading="loading"
    @click:row="editCourse"
    @update:options="onUpdateTableOptions"
    @action="onAction"
  )
</template>
