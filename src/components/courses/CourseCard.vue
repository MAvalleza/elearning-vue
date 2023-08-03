<script setup lang="ts">
import format from 'date-fns/format';
import { computed } from 'vue';
import { type Course } from '@/types/course';

interface Props {
  course: Course
}

const props = withDefaults(defineProps<Props>(), {
  course: () => ({ title: 'Course', isPublished: false })
});

const createdDate = computed(() => {
  if (props.course?.createdAt) {
    return format(props.course.createdAt, 'MMM dd, yyyy');
  } else {
    return 'on unknown date';
  }
})
</script>

<template lang="pug">
v-card(
  height="330"
  rounded="lg"
  :elevation="5"
)
  v-toolbar(color="light-blue").text-white.px-2
    | {{ props.course.subject?.title || 'Subject' }}
    v-spacer
    v-icon(size="sm").pr-2 mdi-clock-outline
    | {{ props.course.totalDuration || 0 }} min
  v-card-text.text-center
    // Icon
    .icon
      v-img(v-if="props.course.icon" :src="props.course.icon" height="100")
      v-icon(v-else size="100") mdi-bookshelf
    // Details
    .details.mt-5
      h3 {{ props.course.title }}
      p.text-caption {{ props.course.authorName }}
      p.text-caption Created {{ createdDate }}
  v-divider
  v-card-actions
    v-btn(block color="light-blue") ENROLL
</template>