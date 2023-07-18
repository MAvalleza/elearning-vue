<script setup>
import { ref, watch } from 'vue';
import { STATUS_LABELS } from '@/constants/statuses';
import { useSubjects } from '@/stores/subjects';
import { useAuth } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import debounce from 'lodash-es/debounce';

// -- PROP AND EMITS --
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  /**
   * Flag if this form is consumed in the subject form
   * 
   * This will hide the subject and author fields
  **/
  subject: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

// -------

const course = ref(props.modelValue);

// Current user
const authStore = useAuth();
const { currentUser } = storeToRefs(authStore);

// Subject search handlers

const subjectSearch = ref(null);

watch(
  subjectSearch,
  (val) => {
    val !== course.value.subject && searchSubject(val);
  }
)

const subjectsStore = useSubjects();
const { subjects } = storeToRefs(subjectsStore)

async function fetchSubjects(keyword) {
  await subjectsStore.fetchSubjects({ keyword });
}

const searchSubject = debounce(keyword => fetchSubjects(keyword), 500);
// --------

function onUpdate() {
  emit('update:modelValue', course.value);
}

</script>

<template lang="pug">
v-form
  v-card
    v-container(fluid)
      v-row
        v-col(cols="12" lg="6")
          v-text-field(
            v-model="course.title"
            variant="outlined"
            placeholder="Mathematics"
            label="Title"
            @update:model-value="onUpdate"
          )
        // Do not show when course is created thru subject
        template(v-if="!subject")
          v-col(cols="12" lg="6")
            v-autocomplete(
              v-model="course.subject"
              v-model:search="subjectSearch"
              label="Subject"
              variant="outlined"
              :items="subjects"
              item-title="title"
              item-value="id"
              hide-no-data
            )
          v-col(cols="12" lg="6")
            v-text-field(
              v-model="currentUser.normalizedName"
              label="Author"
              variant="outlined"
              disabled
            )
        v-col(cols="12" lg="6")
          v-select(
            v-model="course.isPublished"
            label="Status"
            variant="outlined"
            :items="STATUS_LABELS"
            item-title="label"
            item-value="value"
          )
        v-col(cols="12")
          v-text-field(
            v-model="course.description"
            variant="outlined"
            label="Course Description"
            placeholder="e.g. A basic course"
          )
</template>