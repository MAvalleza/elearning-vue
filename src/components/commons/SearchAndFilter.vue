<script setup>
import { ref, toRefs } from 'vue';
import debounce from 'lodash-es/debounce';

const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue']);

const { modelValue } = toRefs(props);
const searchText = ref(modelValue.value);

const onUpdate = debounce(e => {
  emit('update:modelValue', e);
})
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
    v-btn(
      icon="mdi-filter-variant"
    )
</template>