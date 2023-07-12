<script setup>
import { useRoute } from 'vue-router';
import { onMounted, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useSubjects } from '@/stores/subjects';
import { useUI } from '@/stores/ui';
import { mapOptionsToParams } from '@/helpers/tableHelper';
import { VDataTableServer } from 'vuetify/lib/labs/components';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
// import GenericDataTable from '@/components/commons/GenericDataTable.vue';
import SearchAndFilter from '@/components/commons/SearchAndFilter.vue';

const route = useRoute();

const HEADER_BUTTON_OPTS = {
  text: 'ADD NEW SUBJECT',
  flat: true,
  style: { color: 'black' },
  to: { name: 'create-subject' }
};

// UI states
const uiStore = useUI();
const { loading } = storeToRefs(uiStore);

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
  ],
  itemValue: 'title',
};

const subjectsStore = useSubjects();
const { subjects, subjectsTotal } = storeToRefs(subjectsStore);

// Fetch params
const initial = {
  params: {
    page: 1,
    limit: 25,
    sort: null,
    sortDirection: null,
    keyword: null,
    published: null,
    join: ['courses'],
  },
  total: {
    current: 0,
    overall: 0,
  },
};

let fetchParams = reactive({ ...initial.params });

function initialize() {
  fetchParams = reactive({ ...initial.params });
}

async function fetchSubjects() {
  await subjectsStore.fetchSubjects(fetchParams);
}

function onUpdateTableOptions(event) {
  const updatedParams = mapOptionsToParams(event);

  fetchParams = reactive({
    ...initial.params,
    ...updatedParams,
  });

  fetchSubjects();
}

onMounted(() => {
  initialize();
});
</script>

<template lang="pug">
page-header(
  :title="route.meta.title"
  :button-opts="HEADER_BUTTON_OPTS"
  has-center-section
)
  template(#center-section)
    search-and-filter(
      v-model:search-text="fetchParams.keyword"
      v-model:status-filter="fetchParams.published"
      @search="fetchSubjects"
      @filter="fetchSubjects"
    )
page-content
  v-data-table-server(
    v-model:items-per-page="fetchParams.limit"
    v-bind="SUBJECTS_DATA_TABLE"
    :items="subjects"
    :items-length="subjectsTotal"
    :loading="loading"
    @update:options="onUpdateTableOptions"
  )
    template(#[`item.totalCourses`]="{ item }")
      span(v-if="!item.columns.totalCourses") No
      span(v-else) {{ item.columns.totalCourses }}
      span &nbsp;{{ `course${item.columns.totalCourses !== 1 ? 's' : ''}` }}
</template>
