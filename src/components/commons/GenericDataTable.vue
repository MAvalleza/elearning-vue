<script setup>
import { ref } from 'vue';
import { VDataTableServer } from 'vuetify/lib/labs/components';

const emit = defineEmits(['update:options']);

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
  itemValue: {
    type: String,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const itemsPerPage = ref(10);

function onUpdateOptions(event) {
  emit('update:options', event);
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
