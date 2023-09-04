<script setup lang="ts">
import { reactive, onMounted, type Ref, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useUsers } from '@/stores/users';
import { mapOptionsToParams } from '@/helpers/tableHelper';
import { PAGINATION_DATA_TABLE_OPTIONS } from '@/constants/pagination';
import { ROLES_LIST } from '@/constants/roles-and-actions';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import PageConfirmDialog from '@/components/commons/ConfirmDialog.vue';
import SearchAndFilter from '@/components/commons/SearchAndFilter.vue';
import TableActions from '@/components/commons/TableActions.vue';
import type { TableOptions } from '@/types/data-table';
import type { MappedUser } from '@/types/user';

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
    { title: 'Status', align: 'end', key: 'status' },
    { title: '', align: 'end', key: 'actions', sortable: false },
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

// Table operations
function getTableActions(item: MappedUser) {
  const getTableStatusAction = (isActive: boolean) => {
    if (isActive) {
      return {
        icon: {
          icon: 'mdi-close',
        },
        title: 'Set inactive',
        action: 'inactive',
      }
    } else {
      return {
        icon: {
          icon: 'mdi-check',
          color: 'success',
        },
        title: 'Set active',
        action: 'active',
      };
    }
  };

  const DELETE_ACTION = {
    icon: {
      icon: 'mdi-delete',
      color: 'error',
    },
    title: 'Delete',
    action: 'delete',
  };

  return [getTableStatusAction(item.isActive), DELETE_ACTION];
}

function onUpdateTableOptions(options: TableOptions) {
  const updatedParams = mapOptionsToParams(options);

  fetchParams = reactive({
    ...initial.params,
    ...updatedParams,
  });

  fetchUsers();
}

async function onAction({ action, item }: { action: string, item: MappedUser }) {
  const id = item.id;
  const result = await usersStore.onTableAction({ id, action });

  if (result?.delete) {
    await deleteUser(id);
  }

  // Re-fetch users
  fetchUsers();
}

// Dialog operations
const confirmDialog: Ref = ref(null);

async function deleteUser(id: string) {
  const confirm = await confirmDialog.value.open({
    title: 'Delete User',
    message:
      'Are you sure you want to delete this user?',
    primaryAction: 'DELETE',
    primaryColor: 'error',
  });

  if (confirm) {
    await usersStore.deleteUser(id);
  }
}

// Initializations
function initialize() {
  fetchParams = reactive({ ...initial.params });
}

onMounted(() => {
  initialize();
})
</script>

<template lang="pug">
page-confirm-dialog(ref="confirmDialog")

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
    template(#[`item.role`]="{ item }")
      span.text-capitalize {{ item.raw.role }}

    template(#[`item.status`]="{ item }")
      span {{ item.raw.isActive ? 'Active' : 'Inactive' }}

    template(#[`item.actions`]="{ item }")
      table-actions(
        :actions="getTableActions(item.raw)"
        @action="onAction({ action: $event, item: item.raw })"
      )
</template>