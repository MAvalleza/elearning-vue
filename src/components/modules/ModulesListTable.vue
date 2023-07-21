<script setup>
import { ref } from 'vue';
import { getTableStatusAction } from '@/helpers/tableHelper';
import TableActions from '@/components/commons/TableActions.vue';

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
});

const emit = defineEmits(['update:options', 'action', 'click:row']);

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

function getTableActions(item) {
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

function getItemCourse(item) {
  const { courseTitle, course } = item.raw;

  return courseTitle || course.title;
}

function getItemStatus(item) {
  const { status, isPublished } = item.raw;

  return status || (isPublished ? 'Published' : 'Draft');
}

function onAction(action, item) {
  emit('action', { action, item });
}

function onUpdateTableOptions(event) {
  emit('update:options', event);
}

function onClickRow(event, { item }) {
  emit('click:row', event, { item });
}
</script>

<template lang="pug">
component(
  :is="props.component"
  v-model:items-per-page="itemsPerPage"
  item-value="title"
  :headers="MODULES_TABLE_HEADERS"
  :items="props.items"
  :items-length="props.itemsLength"
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
      :actions="getTableActions(item)"
      @action="onAction($event, item)"
    )
</template>
