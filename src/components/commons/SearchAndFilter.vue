<script setup>
import { ref } from 'vue';
import debounce from 'lodash-es/debounce';
import STATUSES from '@/constants/statuses';

const props = defineProps({
  searchText: {
    type: String,
    default: null,
  },
  statusFilter: {
    type: Boolean,
    default: null,
  },
});

const emit = defineEmits([
  'filter',
  'search',
  'update:searchText',
  'update:statusFilter',
]);

const searchText = ref(props.searchText);

const menu = ref(false);
const published = ref(props.statusFilter);

const applyFilter = debounce(() => {
  emit('update:statusFilter', published.value);
  emit('filter');
}, 500);

const onClear = () => {
  published.value = null;
  applyFilter();
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
        v-card(min-width="300")
          v-card-item
            v-radio-group(v-model="published" column)
              v-radio(
                v-for="(option, key) in STATUSES"
                :key="key"
                v-bind="option"
              )
          v-card-actions
            v-spacer
            v-btn(variant="text" @click="onClear") Clear
            v-btn(color="primary" variant="text" @click="applyFilter") Save

</template>
