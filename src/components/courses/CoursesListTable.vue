<script setup lang="ts">
import { ref } from 'vue';
import size from 'lodash-es/size';
import { getTableActions } from '@/helpers/tableHelper';
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
  hideSubjectColumn: {
    type: Boolean,
    default: false,
  },
  // To prevent any data updates
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:options', 'action', 'click:row']);
//

// DATA TABLE
const itemsPerPage = ref(props.itemsPerPage);

// Courses data
const COURSES_TABLE_HEADERS = [
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
];

function defineHeaders() {
  if (props.hideSubjectColumn) {
    COURSES_TABLE_HEADERS.splice(1, 1);
  }
  return COURSES_TABLE_HEADERS;
}

function getItemAuthor(item: GenericTableItem['item']) {
  const { authorName, author } = item.raw;

  if (!authorName && !author) return '';

  return authorName || `${author?.firstName || ''} ${author?.lastName || ''}`;
}

function getItemStatus(item: GenericTableItem['item']) {
  const { status, isPublished }: { status?: string; isPublished: boolean } =
    item.raw;

  return status || (isPublished ? 'Published' : 'Draft');
}

function getItemTotalModules(item: GenericTableItem['item']) {
  const { totalModules, moduleIds } = item.raw;

  return totalModules || size(moduleIds);
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
</script>

<template lang="pug">
component(
  :is="props.component"
  v-model:items-per-page="itemsPerPage"
  item-value="title"
  :headers="defineHeaders()"
  :items="props.items"
  :items-length="props.itemsLength"
  :loading="props.loading"
  :items-per-page-options="PAGINATION_DATA_TABLE_OPTIONS"
  @click:row="onClickRow"
  @update:options="onUpdateTableOptions"
)
  template(#[`item.authorName`]="{ item }")
    span {{ getItemAuthor(item) }}

  template(#[`item.totalModules`]="{ item }")
    span(v-if="!getItemTotalModules(item)") No
    span(v-else) {{ getItemTotalModules(item) }}
    span &nbsp;{{ `module${getItemTotalModules(item) !== 1 ? 's' : ''}` }}

  template(#[`item.status`]="{ item }")
    span {{ getItemStatus(item) }}

  template(#[`item.actions`]="{ item }")
    table-actions(
      v-if="!props.disabled"
      :actions="getTableActions(item)"
      @action="onAction($event, item)"
    )
</template>
