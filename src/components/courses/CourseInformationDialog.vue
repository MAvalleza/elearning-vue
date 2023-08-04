<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';
import format from 'date-fns/format';
import { type Course } from '@/types/course';

const isDialogVisible = ref(false)

const course: Ref = ref({})

const createdDate = computed(() => {
  if (course.value?.createdAt) {
    return format(course.value.createdAt, 'MMM dd, yyyy');
  } else {
    return 'on unknown date';
  }
})

defineExpose({
  open,
});

const resolveResponse: Ref = ref(() => { });
const rejectResponse: Ref = ref(() => { });

async function open(selectedCourse: Course) {
  course.value = selectedCourse
  isDialogVisible.value = true;

  return new Promise((resolve, reject) => {
    resolveResponse.value = resolve;
    rejectResponse.value = reject;
  });
}

function close() {
  resolveResponse.value(false);
  isDialogVisible.value = false;
}
</script>

<template lang="pug">
v-dialog(v-model="isDialogVisible" width="500" persistent)
  v-card
    v-toolbar(density="compact" color="light-blue")
      v-toolbar-title.text-overline Course Information
      v-spacer
      v-btn(icon="mdi-close" @click="close")
    v-card-item
      div.text-overline
        | {{ course.subject.title }}
      div.text-h5
        strong {{ course.title }}
    v-card-text.d-flex.flex-column
      div {{ course.description }}
      div.mt-3
        span.font-weight-medium Author:
        span &nbsp;{{ course.authorName }}
      div
        span.font-weight-medium Created:
        span &nbsp;{{ createdDate }}
    // TODO: Modules
    // TODO: ENROLL
    v-divider
    v-card-actions
      v-btn(
        block
        variant="text"
        color="light-blue"
      ) ENROLL
</template>