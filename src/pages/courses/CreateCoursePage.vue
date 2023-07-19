<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useCourses } from '@/stores/courses';
import { useUI } from '@/stores/ui';
import { useAuth } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import CourseForm from '@/components/courses/CourseForm.vue';

const route = useRoute();

const uiStore = useUI();
const { loading } = storeToRefs(uiStore);

const authStore = useAuth();
const { currentUser } = storeToRefs(authStore);

const coursesStore = useCourses();
const newCourse = ref({
  title: null,
  isPublished: null,
  subject: null,
  description: null,
  icon: null,
});

const form = ref(null);
function submitForm() {
  form.value.submit();
}

function createCourse() {
  const data = {
    ...newCourse.value,
    author: currentUser.value.id,
  };

  coursesStore.createCourse(data);
}

const HEADER_BUTTON_OPTS = {
  text: 'Save',
};
</script>

<template lang="pug">
app-loader(:is-visible="loading")

page-header(
  :title="route.meta.title"
  :button-opts="HEADER_BUTTON_OPTS"
  @click="submitForm"
)

page-content
  course-form(
    ref="form"
    v-model="newCourse"
    @submit="createCourse"
  )
</template>
