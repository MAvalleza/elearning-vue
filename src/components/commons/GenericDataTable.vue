<script setup>
import { ref } from 'vue';
import { VDataTableServer } from 'vuetify/lib/labs/components';

const emit = defineEmits(['update:options', 'update:items-per-page']);

const props = defineProps({
  headers: {
    type: Array,
    default: () => [],
  },
  totalItems: {
    type: [String, Number],
    default: 0,
  },
  items: {
    type: Array,
    default: () => [],
  },
  itemsPerPage: {
    type: [String, Number],
    default: 25,
  },
  itemValue: {
    type: String,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const itemsPerPage = ref(props.itemsPerPage);

function onUpdateOptions(event) {
  emit('update:options', event);
  emit('update:items-per-page', event.itemsPerPage);
}
</script>

<template lang="pug">
v-data-table-server(
  v-model:items-per-page="itemsPerPage"
  :headers="props.headers"
  :items-length="props.totalItems"
  :items="props.items"
  :loading="props.loading"
  :item-value="props.itemValue"
  @update:options="onUpdateOptions"
)
</template>
