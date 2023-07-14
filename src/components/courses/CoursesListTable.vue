<script setup>
import { ref } from 'vue';
import { getTableStatusAction } from '@/helpers/tableHelper';
import { VDataTableServer } from 'vuetify/lib/labs/components';
import TableActions from '@/components/commons/TableActions.vue';

const props = defineProps({
  items: {
    type: Array,
    default: () => ([]),
  },
  itemsPerPage: {
    type: [String, Number],
    default: 25,
  },
  itemsLength: {
    type: [String, Number],
    default: 0,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:options', 'action']);

const itemsPerPage = ref(props.itemsPerPage);

// Courses data
const COURSES_DATA_TABLE = {
  headers: [
    {
      title: 'Title',
      align: 'start',
      sortable: true,
      key: 'title',
    },
    { title: 'Subject', align: 'end', key: 'subjectTitle' },
    { title: 'Author', align: 'end', key: 'authorName' },
    { title: 'Modules', align: 'end', key: 'totalModules' },
    { title: 'Status', align: 'end', key: 'status' },
    { title: '', align: 'end', key: 'actions', sortable: false },
  ],
  itemValue: 'title',
};

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

function onAction(action, item) {
  emit('action', { action, item });
}

function onUpdateTableOptions(event) {
  emit('update:options', event);
}
</script>

<template lang="pug">
v-data-table-server(
  v-model:items-per-page="itemsPerPage"
  v-bind="COURSES_DATA_TABLE"
  :items="props.items"
  :items-length="props.itemsLength"
  :loading="props.loading"
  @update:options="onUpdateTableOptions"
)
  template(#[`item.totalModules`]="{ item }")
    span(v-if="!item.columns.totalModules") No
    span(v-else) {{ item.columns.totalModules }}
    span &nbsp;{{ `module${item.columns.totalModules !== 1 ? 's' : ''}` }}

  template(#[`item.actions`]="{ item }")
    table-actions(
      :actions="getTableActions(item)"
      @action="onAction($event, item)"
    )
</template>