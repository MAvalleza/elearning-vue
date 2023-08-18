<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuth } from '@/stores/auth';
import { ROLES } from '@/constants/roles-and-actions';
import { STATUS_LABELS } from '@/constants/statuses';
import { REQUIRED_RULE } from '@/constants/validation-rules';
import ImageUploader from '@/components/commons/ImageUploader.vue';
import SubjectSearch from '@/components/commons/SubjectSearch.vue';

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
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'submit']);

// -------

const course = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});

// Current user
const authStore = useAuth();
const { currentUser } = storeToRefs(authStore);

// Form handler
const form: Ref = ref(null);
async function submit() {
  const { valid } = await form.value.validate();

  if (valid) {
    emit('submit', course.value);
  }
}

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
            :rules="[REQUIRED_RULE]"
          )
        // Do not show when course is created thru subject
        template(v-if="!subject")
          v-col(cols="12" lg="6")
            subject-search(v-model="course.subjectId" required)
          v-col(cols="12" lg="6")
            v-text-field(
              v-model="currentUser.normalizedName"
              label="Author"
              variant="outlined"
              :disabled="currentUser.role === ROLES.INSTRUCTOR"
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
        v-col(cols="12")
          image-uploader(v-model="course.icon" label="Upload course icon")
</template>
