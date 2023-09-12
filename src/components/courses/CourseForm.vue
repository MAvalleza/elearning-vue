<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';
import { RESOURCE_STATUS_LABELS } from '@/constants/statuses';
import { REQUIRED_RULE } from '@/constants/validation-rules';
import { useAuth } from '@/stores/auth';
import ImageUploader from '@/components/commons/ImageUploader.vue';
import SubjectSearch from '@/components/commons/SubjectSearch.vue';
import { storeToRefs } from 'pinia';

// PROPS AND EMITS
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
    default: false,
  },
  // Make all form fields disabled
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'submit']);
//

const authStore = useAuth();
const { currentUser }: { currentUser: Ref } = storeToRefs(authStore);

// COURSE MODEL
const course = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});
//

const authorName = computed(() => {
  if (course.value?.author) {
    return `${course.value.author.firstName} ${course.value.author.lastName}`;
  } else {
    return currentUser.value.normalizedName;
  }
});

// FORM HANDLER
const form: Ref = ref(null);
async function submit() {
  const { valid } = await form.value.validate();

  if (valid) {
    emit('submit', course.value);
  }
}

// EXPOSED FUNCTIONS
defineExpose({ submit });
</script>

<template lang="pug">
v-form(ref="form")
  v-card
    v-container(fluid)
      v-row
        v-col(cols="12" lg="6")
          v-text-field(
            v-model="course.title"
            variant="outlined"
            placeholder="Mathematics"
            label="Title"
            :disabled="props.disabled"
            :rules="[REQUIRED_RULE]"
          )
        // Do not show when course is created thru subject
        template(v-if="!subject")
          v-col(cols="12" lg="6")
            subject-search(
              v-model="course.subjectId"
              :disabled="props.disabled"
              required
            )
          v-col(cols="12" lg="6")
            v-text-field(
              :model-value="authorName"
              label="Author"
              variant="outlined"
              disabled
            )
        v-col(cols="12" lg="6")
          v-select(
            v-model="course.isPublished"
            label="Status"
            variant="outlined"
            item-title="label"
            item-value="value"
            :items="RESOURCE_STATUS_LABELS"
            :disabled="props.disabled"
          )
        v-col(cols="12")
          v-text-field(
            v-model="course.description"
            variant="outlined"
            label="Course Description"
            placeholder="e.g. A basic course"
            :disabled="props.disabled"
          )
        v-col(cols="12")
          image-uploader(
            v-model="course.icon"
            label="Upload course icon"
            :disabled="props.disabled"
          )
</template>
