<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted, reactive, ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuth } from '@/stores/auth';
import { useSubjects } from '@/stores/subjects';
import { PAGINATION_DATA_TABLE_OPTIONS } from '@/constants/pagination';
import { mapOptionsToParams, getTableActions } from '@/helpers/tableHelper';
import { type GenericTableItem, type TableOptions } from '@/types/data-table';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import PageConfirmDialog from '@/components/commons/ConfirmDialog.vue';
import SearchAndFilter from '@/components/commons/SearchAndFilter.vue';
import TableActions from '@/components/commons/TableActions.vue';

// ROUTER
const router = useRouter();
const route = useRoute();

// AUTH
const authStore = useAuth();

// UI
const HEADER_BUTTON_OPTS = {
  text: 'ADD NEW SUBJECT',
  flat: true,
  style: { color: 'black' },
  to: { name: 'create-subject' },
};

const confirmDialog: Ref = ref(null);

// SUBJECT OPERATIONS
const subjectsStore = useSubjects();
const { subjects, subjectsTotal, loadingSubjects } = storeToRefs(subjectsStore);

async function fetchSubjects() {
  await subjectsStore.fetchSubjects(fetchParams);
}

function editSubject(_event: Event, { item }: GenericTableItem) {
  router.push({
    name: 'edit-subject',
    params: { subjectId: item.raw.id },
  });
}

async function deleteSubject(id: string) {
  const confirm = await confirmDialog.value.open({
    title: 'Delete Subject',
    message:
      'Deleting a subject will also delete its courses, are you sure you want to delete this subject?',
    primaryAction: 'DELETE',
    primaryColor: 'error',
  });

  if (confirm) {
    await subjectsStore.deleteSubject(id);

    fetchSubjects();
  }
}

// FETCH PARAMS
const initial = {
  params: {
    page: 1,
    limit: 25,
    join: ['courses'],
  },
  total: {
    current: 0,
    overall: 0,
  },
};

let fetchParams = reactive({ ...initial.params });

// TABLE OPERATIONS
// Subjects data
const SUBJECTS_DATA_TABLE = {
  headers: [
    {
      title: 'Title',
      align: 'start',
      sortable: true,
      key: 'title',
    },
    { title: 'Courses', align: 'end', key: 'totalCourses' },
    { title: 'Status', align: 'end', key: 'status' },
    { title: '', align: 'end', key: 'actions', sortable: false },
  ],
  itemValue: 'title',
};

function onUpdateTableOptions(options: TableOptions) {
  // We update the fetch Params before invoking fetch request
  const updatedParams = mapOptionsToParams(options);

  fetchParams = reactive({
    ...initial.params,
    ...updatedParams,
  });

  fetchSubjects();
}

// On selection of a table action
async function onAction(action: string, item: GenericTableItem['item']) {
  const id = item.raw.id;
  const result = await subjectsStore.onTableAction({ id, action });

  if (result?.delete) {
    await deleteSubject(id);
  } else {
    fetchSubjects();
  }
}

// INITIALIZATIONS
function initialize() {
  subjectsStore.$reset();
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
      @search="fetchSubjects"
      @filter="fetchSubjects"
      @clear:filter="fetchSubjects"
    )
page-content
  v-data-table-server(
    v-model:items-per-page="fetchParams.limit"
    v-bind="SUBJECTS_DATA_TABLE"
    :items="subjects"
    :items-length="subjectsTotal"
    :items-per-page-options="PAGINATION_DATA_TABLE_OPTIONS"
    :loading="loadingSubjects"
    @click:row="editSubject"
    @update:options="onUpdateTableOptions"
  )
    template(#[`item.totalCourses`]="{ item }")
      span(v-if="!item.columns.totalCourses") No
      span(v-else) {{ item.columns.totalCourses }}
      span &nbsp;{{ `course${item.columns.totalCourses !== 1 ? 's' : ''}` }}

    template(#[`item.actions`]="{ item }")
      table-actions(
        v-if="authStore.isInstructor"
        :actions="getTableActions(item)"
        @action="onAction($event, item)"
      )
</template>
