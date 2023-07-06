<script setup>
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useSubjects } from '@/stores/subjects';
import { useUI } from '@/stores/ui';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import GenericDataTable from '@/components/commons/GenericDataTable.vue';
import { SUBJECTS_DATA_TABLE } from '@/constants/data-table-opts';

const route = useRoute();

const HEADER_BUTTON_OPTS = {
  text: 'ADD NEW SUBJECT',
  flat: true,
};

const uiStore = useUI();
const { loading } = storeToRefs(uiStore);

const subjectsStore = useSubjects();
const { subjects, subjectsTotal } = storeToRefs(subjectsStore);

async function fetchSubjects() {
  await subjectsStore.fetchSubjects();
}

onMounted(() => {
  fetchSubjects();
})
</script>

<template lang="pug">
page-header(
  :title="route.meta.title"
  :button-opts="HEADER_BUTTON_OPTS"
)

page-content
  // TODO: Put courses word in courses column
  generic-data-table( 
    v-bind="SUBJECTS_DATA_TABLE"
    :items="subjects"
    :total-items="subjectsTotal"
    :loading="loading"
  )
</template>
