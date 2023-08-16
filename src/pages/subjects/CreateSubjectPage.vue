<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { useSubjects } from '@/stores/subjects';
import { storeToRefs } from 'pinia';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import SubjectForm from '@/components/subjects/SubjectForm.vue';

const route = useRoute();

const HEADER_BUTTON_OPTS = {
  text: 'Save',
};

const subjectsStore = useSubjects();
const { loadingSubjects } = storeToRefs(subjectsStore);
const newSubject: Ref = ref({ title: null, isPublished: false });

const createForm: Ref = ref(null);
function submitForm() {
  createForm.value.submit();
}

function createSubject() {
  subjectsStore.createSubject(newSubject.value);
}
</script>

<template lang="pug">
app-loader(:is-visible="loadingSubjects")

page-header(
  :title="route.meta.title"
  :button-opts="HEADER_BUTTON_OPTS"
  @click="submitForm"
)

page-content
  subject-form(
    ref="createForm"
    v-model="newSubject"
    @submit="createSubject"
  )
</template>
