<script setup>
import { useRoute } from 'vue-router';
import { onMounted, reactive, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUI } from '@/stores/ui';
import { useModules } from '@/stores/modules';
import { mapOptionsToParams } from '@/helpers/tableHelper';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import PageConfirmDialog from '@/components/commons/ConfirmDialog.vue';
import SearchAndFilter from '@/components/commons/SearchAndFilter.vue';
import ModulesListTable from '@/components/modules/ModulesListTable.vue';

const route = useRoute();

const HEADER_BUTTON_OPTS = {
  text: 'ADD NEW MODULE',
  flat: true,
  style: { color: 'black' },
  to: { name: 'create-module' },
};

// UI states
const uiStore = useUI();
const { loading } = storeToRefs(uiStore);
const confirmDialog = ref(null);

// Fetch params
const initial = {
  params: {
    page: 1,
    limit: 25,
    sort: null,
    sortDirection: null,
    keyword: null,
    published: null,
    join: ['course'],
  },
  total: {
    current: 0,
    overall: 0,
  },
};

let fetchParams = reactive({ ...initial.params });

function initialize() {
  modulesStore.$reset();
  fetchParams = reactive({ ...initial.params });
}

const modulesStore = useModules();
const { modules, modulesTotal } = storeToRefs(modulesStore);

async function fetchModules() {
  await modulesStore.fetchModules(fetchParams);
}

// function editCourse(event, { item }) {
//   router.push({
//     name: 'edit-course',
//     params: { courseId: item.raw.id },
//   });
// }

// async function deleteCourse(id) {
//   const confirm = await confirmDialog.value.open({
//     title: 'Delete Course',
//     message:
//       'Deleting a course will also delete its modules, are you sure you want to delete this course?',
//     primaryAction: 'DELETE',
//     primaryColor: 'error',
//   });

//   if (confirm) {
//     await modulesStore.deleteCourse(id);
//   }
// }

function onUpdateTableOptions(event) {
  const updatedParams = mapOptionsToParams(event);

  fetchParams = reactive({
    ...initial.params,
    ...updatedParams,
  });

  fetchModules();
}

// async function onAction({ action, item }) {
//   const id = item.raw.id;

//   switch (action) {
//     case 'delete':
//       await deleteCourse(id);
//       break;
//     case 'publish':
//       await modulesStore.updateCourse(id, { isPublished: true });
//       break;
//     case 'draft':
//       await modulesStore.updateCourse(id, { isPublished: false });
//       break;
//     default:
//       break;
//   }

//   // Re-fetch courses
//   fetchCourses();
// }

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
      @search="fetchModules"
      @filter="fetchModules"
      @clear:filter="fetchModules"
    )
page-content
  modules-list-table(
    v-model:items-per-page="fetchParams.limit"
    :items="modules"
    :items-length="modulesTotal"
    :loading="loading"
    @update:options="onUpdateTableOptions"
  )
</template>