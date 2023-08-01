<script setup lang="ts">
import { computed, ref, watch, onMounted, type Ref } from 'vue';
import debounce from 'lodash-es/debounce';
import isEmpty from 'lodash-es/isEmpty';
import { storeToRefs } from 'pinia';
import { useCourses } from '@/stores/courses';
import { STATUS_LABELS } from '@/constants/statuses';
import { REQUIRED_RULE } from '@/constants/validation-rules';
import { type Module } from '@/types/module';
import { type Content } from '@/types/content';
import TextEditor from '@/components/commons/TextEditor.vue';

// -- PROP AND EMITS --
interface Props {
  modelValue: Module,
  content: Content | object,
  hideCourseField?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({
    title: '',
    duration: 0,
    isPublished: false
  }),
  content: () => ({ content: null }),
  /**
   * This will hide the course field.
   * 
   * Usually `true` when component is consumed in course/subject form
   **/
  hideCourseField: false,
});

const emit = defineEmits(['update:modelValue', 'update:content', 'submit']);

// -------

const mod = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});

const modContent = computed({
  get() {
    return props.content;
  },
  set(val) {
    emit('update:content', val);
  }
});

// Form handler
const form: Ref = ref(null);
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
// And if there is no course selected
watch(courseSearch, val => {
  val !== mod.value.course && !mod.value.courseId && searchCourse(val);
});

const coursesStore = useCourses();
const { courses } = storeToRefs(coursesStore);

async function fetchCourses(keyword?: string) {
  await coursesStore.fetchCourses({ keyword });
}

const searchCourse = debounce(keyword => fetchCourses(keyword), 500);

onMounted(() => {
  // Since we get the data from courses store, it is possible that
  // data has not yet been fetched yet.
  if (isEmpty(courses.value)) {
    fetchCourses();
  }
})
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
        v-col(v-if="!hideCourseField" cols="12" lg="6")
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
          v-select(
            v-model="mod.isPublished"
            label="Status"
            variant="outlined"
            :items="STATUS_LABELS"
            item-title="label"
            item-value="value"
          )
        v-col(cols="12" lg="6")
          v-text-field(
            v-model="mod.duration"
            label="Duration"
            variant="outlined"
            type="number"
            :rules="[REQUIRED_RULE]"
          )
    // Rich text editor
    div(style="height: 600px")
      text-editor(v-model="modContent.content")
</template>
