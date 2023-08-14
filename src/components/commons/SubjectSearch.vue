<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useSubjects } from '@/stores/subjects';
import { storeToRefs } from 'pinia';
import debounce from 'lodash-es/debounce';
import { REQUIRED_RULE } from '@/constants/validation-rules';

interface Props {
  modelValue?: string | null;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  required: false,
});

const emit = defineEmits(['update:modelValue']);

const subjectId = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});

const subjectSearch = ref(null);

// Proceed with search when current search query is not equal to previous one
// And if there is no subject selected
watch(subjectSearch, val => {
  val !== subjectId.value && !subjectId.value && searchSubject(val);
});

const subjectsStore = useSubjects();
const { subjects, loadingSubjects } = storeToRefs(subjectsStore);

async function fetchSubjects(keyword?: string) {
  await subjectsStore.fetchSubjects({ keyword });
}

const searchSubject = debounce(keyword => fetchSubjects(keyword), 500);
</script>

<template lang="pug">
v-autocomplete(
  v-model="subjectId"
  v-model:search="subjectSearch"
  label="Subject"
  variant="outlined"
  item-title="title"
  item-value="id"
  hide-no-data
  clearable
  :items="subjects"
  :loading="loadingSubjects"
  :rules="required ? [REQUIRED_RULE] : []"
)
</template>
