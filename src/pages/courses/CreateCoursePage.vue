<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useCourses } from '@/stores/courses';
import { useUI } from '@/stores/ui';
import { storeToRefs } from 'pinia';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import CourseForm from '@/components/courses/CourseForm.vue';

const route = useRoute();

const uiStore = useUI();
const { loading } = storeToRefs(uiStore);

const HEADER_BUTTON_OPTS = {
  text: 'Save'
}

const coursesStore = useCourses();
const newCourse = ref({ title: null, isPublished: null })

function createCourse() {
  coursesStore.createCourse(newCourse.value);
}
</script>

<template lang="pug">
app-loader(:is-visible="loading")

page-header(
  :title="route.meta.title"
  :button-opts="HEADER_BUTTON_OPTS"
  @click="createCourse"
)

page-content
  course-form
</template>