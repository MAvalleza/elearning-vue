<script setup lang="ts">
import { ref, type Ref } from 'vue';
import debounce from 'lodash-es/debounce';
import { STATUS_LABELS } from '@/constants/statuses';

const props = defineProps({
  searchText: {
    type: String,
    default: null,
  },
  statusFilter: {
    type: Boolean,
    default: null,
  },
  filterMenuWidth: {
    type: [String, Number],
    default: '300',
  },
});

const emit = defineEmits([
  'clear:filter',
  'filter',
  'search',
  'update:searchText',
  'update:statusFilter',
]);

const searchText = ref(props.searchText);

const menu = ref(false);
const published: Ref = ref(props.statusFilter);

const applyFilter = debounce(() => {
  emit('update:statusFilter', published.value);
  emit('filter');
}, 500);

const onClear = () => {
  published.value = null;
  emit('update:statusFilter', published.value);
  emit('clear:filter');
};

const onUpdate = debounce(e => {
  emit('update:searchText', e);
  emit('search', e);
}, 1000);
</script>

<template lang="pug">
v-text-field(
  v-model="searchText"
  variant="solo"
  label="Search"
  density="compact"
  rounded
  bg-color="white"
  prepend-inner-icon="mdi-magnify"
  @update:model-value="onUpdate"
)
  template(#append)
    v-btn(icon)
      v-icon mdi-filter-variant
      v-menu(
        v-model="menu"
        activator="parent"
        :close-on-content-click="false"
        location="end"
      )
        v-card(:min-width="props.filterMenuWidth")
          v-card-item
            v-select(
              v-model="published"
              variant="outlined"
              label="Status"
              :items="STATUS_LABELS"
              density="comfortable"
              item-title="label"
            )
            slot(name="custom-filter")
          v-card-actions
            v-spacer
            v-btn(variant="text" @click="onClear") Clear
            v-btn(color="primary" variant="text" @click="applyFilter") Save
</template>
