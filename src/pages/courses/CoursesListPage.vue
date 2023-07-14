<script setup>
import { useRoute } from 'vue-router';
import { onMounted, reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useCourses } from '@/stores/courses';
import { useUI } from '@/stores/ui';
import { mapOptionsToParams, getTableStatusAction } from '@/helpers/tableHelper';
import { VDataTableServer } from 'vuetify/lib/labs/components';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
// import PageConfirmDialog from '@/components/commons/ConfirmDialog.vue';
import SearchAndFilter from '@/components/commons/SearchAndFilter.vue';
// import TableActions from '@/components/commons/TableActions.vue';

// const router = useRouter();
const route = useRoute();

const HEADER_BUTTON_OPTS = {
  text: 'ADD NEW COURSE',
  flat: true,
  style: { color: 'black' },
  // to: { name: 'create-subject' }
};

// UI states
const uiStore = useUI();
const { loading } = storeToRefs(uiStore);
// const confirmDialog = ref(null);

// Courses data
const COURSES_DATA_TABLE = {
  headers: [
    {
      title: 'Title',
      align: 'start',
      sortable: true,
      key: 'title',
    },
    { title: 'Subject', align: 'end', key: 'subject' },
    { title: 'Author', align: 'end', key: 'author' },
    { title: 'Modules', align: 'end', key: 'modules' },
    { title: 'Duration', align: 'end', key: 'duration' },
    { title: 'Status', align: 'end', key: 'status' },
    { title: '', align: 'end', key: 'actions', sortable: false },
  ],
  itemValue: 'title',
};

const coursesStore = useCourses();
const { courses, coursesTotal } = storeToRefs(coursesStore);

// Fetch params
const initial = {
  params: {
    page: 1,
    limit: 25,
    sort: null,
    sortDirection: null,
    keyword: null,
    published: null,
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
}

// function editCourse(event, { item }) {
//   router.push({
//     name: 'edit-subject',
//     params: { id: item.raw.id },
//   });
// }

// async function deleteSubject(id) {
//   const confirm = await confirmDialog.value.open({
//     title: 'Delete Subject',
//     message: 'Deleting a subject will also delete its courses, are you sure you want to delete this subject?',
//     primaryAction: 'DELETE',
//     primaryColor: 'error',
//   });

//   if (confirm) {
//     await subjectsStore.deleteSubject(id);
//   }
// }

function onUpdateTableOptions(event) {
  const updatedParams = mapOptionsToParams(event);

  fetchParams = reactive({
    ...initial.params,
    ...updatedParams,
  });

  fetchCourses();
}

function getTableActions(item) {
  const DELETE_ACTION = {
    icon: {
      icon: 'mdi-delete',
      color: 'error',
    },
    title: 'Delete',
    action: 'delete'
  };

  return [
    getTableStatusAction(item.raw.isPublished),
    DELETE_ACTION,
  ];
}

// async function onAction(action, item) {
//   const id = item.raw.id;

//   switch (action) {
//     case 'delete':
//       await deleteSubject(id);
//       break;
//     case 'publish':
//       await subjectsStore.updateSubject(id, { isPublished: true });
//       break;
//     case 'draft':
//       await subjectsStore.updateSubject(id, { isPublished: false });
//       break;
//     default:
//       break;
//   }

//   // Re-fetch subjects
//   fetchSubjects();
// }

onMounted(() => {
  initialize();
});
</script>

<template lang="pug">
//- page-confirm-dialog(ref="confirmDialog")

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
    )
page-content
  v-data-table-server(
    v-model:items-per-page="fetchParams.limit"
    v-bind="COURSES_DATA_TABLE"
    :items="courses"
    :items-length="coursesTotal"
    :loading="loading"
    @update:options="onUpdateTableOptions"
  )
    //- template(#[`item.totalCourses`]="{ item }")
    //-   span(v-if="!item.columns.totalCourses") No
    //-   span(v-else) {{ item.columns.totalCourses }}
    //-   span &nbsp;{{ `course${item.columns.totalCourses !== 1 ? 's' : ''}` }}

    template(#[`item.actions`]="{ item }")
      table-actions(
        :actions="getTableActions(item)"
      )
</template>
