<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import SubjectForm from '@/components/subjects/SubjectForm.vue';

const route = useRoute();

const HEADER_BUTTON_OPTS = {
  text: 'Save'
}

const newSubject = ref({ title: null, isPublished: null })
</script>

<template lang="pug">
page-header(
  :title="route.meta.title"
  :button-opts="HEADER_BUTTON_OPTS"
)

page-content
  subject-form(v-model="newSubject")
</template>