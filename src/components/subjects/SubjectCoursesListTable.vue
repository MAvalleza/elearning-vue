<script setup>
import { VDataTableVirtual } from 'vuetify/lib/labs/components';
import { size, isEmpty } from 'lodash-es';

const props = defineProps({
  items: {
    type: Array,
    default: () => ([]),
  },

})
// Courses data
const COURSES_DATA_TABLE = {
  headers: [
    {
      title: 'Title',
      align: 'start',
      sortable: true,
      key: 'title',
    },
    { title: 'Modules', align: 'end', key: 'totalModules' },
    { title: 'Status', align: 'end', key: 'status' },
    { title: '', align: 'end', key: 'actions', sortable: false },
  ],
  itemValue: 'title',
};
</script>

<template lang="pug">
v-data-table-virtual(
  v-bind="COURSES_DATA_TABLE"
  :items="props.items"
).elevation-1
  template(#[`item.totalModules`]="{ item }")
    span(v-if="isEmpty(item.raw.moduleIds)") No
    span(v-else) {{ size(item.raw.moduleIds) }}
    span &nbsp;{{ `module${size(item.raw.moduleIds) !== 1 ? 's' : ''}` }}

  template(#[`item.status`]="{ item }")
    span {{ item.raw.isPublished ? 'Published' : 'Draft' }}
</template>