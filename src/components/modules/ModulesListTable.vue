<script setup lang="ts">
import { ref } from 'vue';
import { getTableStatusAction } from '@/helpers/tableHelper';
import { PAGINATION_DATA_TABLE_OPTIONS } from '@/constants/pagination';
import TableActions from '@/components/commons/TableActions.vue';
import { type GenericTableItem, type TableOptions } from '@/types/data-table';

// PROPS AND EMITS
const props = defineProps({
  component: {
    type: String,
    default: 'v-data-table-server',
  },
  items: {
    type: Array,
    default: () => [],
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
  // Flag for hiding course column
  hideCourseColumn: {
    type: Boolean,
    default: false,
  },
  // Prevent data updates from table
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:options', 'action', 'click:row']);
//

// DATA TABLE
const itemsPerPage = ref(props.itemsPerPage);

// Modules data
const MODULES_TABLE_HEADERS = [
  {
    title: 'Title',
    align: 'start',
    sortable: true,
    key: 'title',
  },
  { title: 'Course', align: 'end', key: 'courseTitle' },
  { title: 'Duration', align: 'end', key: 'duration' },
  { title: 'Status', align: 'end', key: 'status' },
  { title: '', align: 'end', key: 'actions', sortable: false },
];

function defineHeaders() {
  if (props.hideCourseColumn) {
    MODULES_TABLE_HEADERS.splice(1, 1);
  }
  return MODULES_TABLE_HEADERS;
}

function getTableActions(item: GenericTableItem['item']) {
  const DELETE_ACTION = {
    icon: {
      icon: 'mdi-delete',
      color: 'error',
    },
    title: 'Delete',
    action: 'delete',
  };

  return [getTableStatusAction(item.raw.isPublished), DELETE_ACTION];
}

function getItemCourse(item: GenericTableItem['item']) {
  const { courseTitle, course } = item.raw;

  return course?.title || courseTitle;
}

function getItemStatus(item: GenericTableItem['item']) {
  const { status, isPublished } = item.raw;

  return status || (isPublished ? 'Published' : 'Draft');
}

function onAction(action: string, item: GenericTableItem['item']) {
  emit('action', { action, item });
}

function onUpdateTableOptions(options: TableOptions) {
  emit('update:options', options);
}

function onClickRow(event: Event, { item }: GenericTableItem) {
  emit('click:row', event, { item });
}
//
</script>

<template lang="pug">
component(
  :is="props.component"
  v-model:items-per-page="itemsPerPage"
  item-value="title"
  :headers="defineHeaders()"
  :items="props.items"
  :items-length="props.itemsLength"
  :items-per-page-options="PAGINATION_DATA_TABLE_OPTIONS"
  :loading="props.loading"
  @click:row="onClickRow"
  @update:options="onUpdateTableOptions"
)
  template(#[`item.courseTitle`]="{ item }")
    span {{ getItemCourse(item) }}

  template(#[`item.duration`]="{ item }")
    span {{ item.raw.duration }} min

  template(#[`item.status`]="{ item }")
    span {{ getItemStatus(item) }}

  template(#[`item.actions`]="{ item }")
    table-actions(
      v-if="!props.disabled"
      :actions="getTableActions(item)"
      @action="onAction($event, item)"
    )
</template>
