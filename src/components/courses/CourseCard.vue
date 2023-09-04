<script setup lang="ts">
import format from 'date-fns/format';
import { computed } from 'vue';
import type { MappedCourse } from '@/types/course';

// PROPS AND EMITS
interface Props {
  course: Partial<MappedCourse>;
}

const props = withDefaults(defineProps<Props>(), {
  course: () => ({
    title: 'Course',
    isPublished: false,
  }),
});

const emit = defineEmits(['click', 'click:enroll']);
//

// COMPUTED ATTRIBUTES
const authorName = computed(() => {
  if (props.course?.authorName) {
    return props.course.authorName;
  } else if (props.course?.author) {
    return `${props.course.author.firstName} ${props.course.author.lastName}`;
  } else {
    return '';
  }
});

const totalDuration = computed(() => {
  if (props.course?.totalDuration) {
    return props.course.totalDuration;
  } else if (props.course?.modules) {
    return props.course.modules.reduce((acc, i) => acc + i.duration, 0);
  } else {
    return 0;
  }
});

const createdDate = computed(() => {
  if (props.course?.createdAt) {
    return format(props.course.createdAt, 'MMM dd, yyyy');
  } else {
    return 'on unknown date';
  }
});
//

function onEnrollClick() {
  emit('click:enroll');
}
</script>

<template lang="pug">
v-card(
  height="330"
  rounded="lg"
  :elevation="5"
  @click="emit('click')"
)
  v-toolbar(color="light-blue").text-white.px-2.toolbar-title
    span {{ props.course.subject?.title || 'Subject' }}
    v-spacer
    v-icon(size="large").pr-2 mdi-clock-outline
    | {{ totalDuration }} min
  v-card-text.text-center
    // Icon
    .icon
      v-img(v-if="props.course.icon" :src="props.course.icon" height="100")
      v-icon(v-else size="100") mdi-bookshelf
    // Details
    .details.mt-5
      h3 {{ props.course.title }}
      p {{ authorName }}
      p Created {{ createdDate }}
  v-divider
  v-card-actions
    slot(name="action-btn")
      v-btn(block color="light-blue" @click.stop="onEnrollClick") ENROLL
</template>

<style scoped>
.toolbar-title,
.details h3 {
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  /* 171.429% */
  letter-spacing: 0.1px;
}

.details p {
  color: var(--on-surface-white-med-emphasis-60, rgba(0, 0, 0, 0.6));
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  /* 133.333% */
  letter-spacing: 0.4px;
}
</style>
