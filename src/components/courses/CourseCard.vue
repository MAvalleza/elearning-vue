<script setup lang="ts">
import { type Course } from '@/types/course';

interface Props {
  course?: Course
}

const props = withDefaults(defineProps<Props>(), {
  course: () => ({ title: 'Course', isPublished: false })
});
</script>

<template lang="pug">
v-card(
  rounded="lg"
  :elevation="5"
)
  v-toolbar(color="light-blue").text-white.px-2
    | {{ props.course.subject?.title || 'Subject' }}
    v-spacer
    | {{ props.course.totalDuration || 0 }} min
  v-card-text.text-center
    h3 {{ props.course.title }}
    h3 {{ props.course.authorName }}
    // TODO: Format date
    h3 Created {{ props.course.createdAt }}
  v-divider
  v-card-actions
    v-btn(block color="light-blue") ENROLL
</template>