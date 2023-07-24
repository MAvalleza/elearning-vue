<script setup>
import { computed, ref, watch } from 'vue';
import debounce from 'lodash-es/debounce';
import { storeToRefs } from 'pinia';
import { STATUS_LABELS } from '@/constants/statuses';
import { REQUIRED_RULE } from '@/constants/validation-rules';
import { useCourses } from '@/stores/courses';

// -- PROP AND EMITS --
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:modelValue', 'submit']);

// -------

const mod = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});

// Form handler
const form = ref(null);
async function submit() {
  const { valid } = await form.value.validate();

  if (valid) {
    emit('submit', mod.value);
  }
}

defineExpose({ submit });

// Course search handlers
const courseSearch = ref(null);

// Proceed with search when current search query is not equal to previous one
// And if there is no subject selected
watch(courseSearch, val => {
  val !== mod.value.course && !mod.value.courseId && searchCourse(val);
});

const coursesStore = useCourses();
const { courses } = storeToRefs(coursesStore);

async function fetchCourses(keyword) {
  await coursesStore.fetchCourses({ keyword });
}

const searchCourse = debounce(keyword => fetchCourses(keyword), 500);
</script>

<template lang="pug">
v-form(ref="form")
  v-card
    v-container(fluid)
      v-row
        v-col(cols="12" lg="6")
          v-text-field(
            v-model="mod.title"
            variant="outlined"
            placeholder="Introduction"
            label="Title"
            :rules="[REQUIRED_RULE]"
          )
        v-col(cols="12" lg="6")
          v-autocomplete(
            v-model="mod.courseId"
            v-model:search="courseSearch"
            label="Course"
            variant="outlined"
            :items="courses"
            item-title="title"
            item-value="id"
            hide-no-data
            :rules="[REQUIRED_RULE]"
          )
        v-col(cols="12" lg="6")
          v-text-field(
            v-model="mod.duration"
            label="Duration"
            variant="outlined"
            type="number"
            :rules="[REQUIRED_RULE]"
          )
        v-col(cols="12" lg="6")
          v-select(
            v-model="mod.isPublished"
            label="Status"
            variant="outlined"
            :items="STATUS_LABELS"
            item-title="label"
            item-value="value"
          )
        v-col(cols="12")
          v-text-field(
            v-model="mod.description"
            variant="outlined"
            label="Course Description"
            placeholder="e.g. A basic course"
          )
</template>
