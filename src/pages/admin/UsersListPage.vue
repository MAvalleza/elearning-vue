<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useUsers } from '@/stores/users';
import { mapOptionsToParams } from '@/helpers/tableHelper';
import { PAGINATION_DATA_TABLE_OPTIONS } from '@/constants/pagination';
import { ROLES_LIST } from '@/constants/roles-and-actions';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import SearchAndFilter from '@/components/commons/SearchAndFilter.vue';
import type { TableOptions } from '@/types/data-table';

// Router
const route = useRoute();

// Users data
const USERS_DATA_TABLE = {
  headers: [
    {
      title: 'Name',
      align: 'start',
      sortable: true,
      key: 'normalizedName',
    },
    { title: 'Email', align: 'end', key: 'email' },
    { title: 'Role', align: 'end', key: 'role' },
  ],
  itemValue: '',
};

const usersStore = useUsers();
const { users, usersTotal, loadingUsers } = storeToRefs(usersStore);

// Fetch params
const initial = {
  params: {
    page: 1,
    limit: 25,
  },
};

let fetchParams = reactive({ ...initial.params });

async function fetchUsers() {
  await usersStore.fetchUsers(fetchParams);
}

function onUpdateTableOptions(options: TableOptions) {
  const updatedParams = mapOptionsToParams(options);

  fetchParams = reactive({
    ...initial.params,
    ...updatedParams,
  });

  fetchUsers();
}

function initialize() {
  fetchParams = reactive({ ...initial.params });
}

onMounted(() => {
  initialize();
})
</script>

<template lang="pug">
page-header(
  :title="route.meta.title"
  hide-button
  has-center-section
)
  template(#center-section)
    // Search user
    search-and-filter(
      v-model:search-text="fetchParams.keyword"
      @search="fetchUsers"
      @filter="fetchUsers"
      @clear:filter="fetchParams.role = null; fetchUsers()"
    )
      template(#filter)
        v-select(
          v-model="fetchParams.role"
          variant="outlined"
          label="Role"
          :items="ROLES_LIST"
          density="comfortable"
          item-title="text"
          item-value="value"
        )

page-content
  v-data-table-server(
    v-model:items-per-page="fetchParams.limit"
    v-bind="USERS_DATA_TABLE"
    :items="users"
    :items-length="usersTotal"
    :items-per-page-options="PAGINATION_DATA_TABLE_OPTIONS"
    :loading="loadingUsers"
    @update:options="onUpdateTableOptions"
  )
</template>