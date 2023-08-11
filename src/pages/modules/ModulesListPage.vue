<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted, reactive, ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUI } from '@/stores/ui';
import { useModules } from '@/stores/modules';
import { mapOptionsToParams } from '@/helpers/tableHelper';
import {
  type TableActionOpt,
  type GenericTableItem,
  type TableOptions,
} from '@/types/data-table';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import PageConfirmDialog from '@/components/commons/ConfirmDialog.vue';
import SearchAndFilter from '@/components/commons/SearchAndFilter.vue';
import ModulesListTable from '@/components/modules/ModulesListTable.vue';

const route = useRoute();
const router = useRouter();

const HEADER_BUTTON_OPTS = {
  text: 'ADD NEW MODULE',
  flat: true,
  style: { color: 'black' },
  to: { name: 'create-module' },
};

// UI states
const uiStore = useUI();
const { loading } = storeToRefs(uiStore);
const confirmDialog: Ref = ref(null);

// Fetch params
const initial = {
  params: {
    page: 1,
    limit: 25,
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

function editModule(_event: Event, { item }: GenericTableItem) {
  router.push({
    name: 'edit-module',
    params: { moduleId: item.raw.id },
  });
}

async function deleteModule(id: string) {
  const confirm = await confirmDialog.value.open({
    title: 'Delete Module',
    message: 'Are you sure you want to delete this module?',
    primaryAction: 'DELETE',
    primaryColor: 'error',
  });

  if (confirm) {
    await modulesStore.deleteModule(id);
  }
}

function onUpdateTableOptions(event: TableOptions) {
  const updatedParams = mapOptionsToParams(event);

  fetchParams = reactive({
    ...initial.params,
    ...updatedParams,
  });

  fetchModules();
}

async function onAction({ action, item }: TableActionOpt) {
  const id = item.raw.id;
  const result = await modulesStore.onTableAction({ id, action });

  if (result?.delete) await deleteModule(id);

  // Re-fetch modules
  fetchModules();
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
    @click:row="editModule"
    @update:options="onUpdateTableOptions"
    @action="onAction"
  )
</template>
