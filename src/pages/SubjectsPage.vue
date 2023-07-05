<script setup>
import { useRoute } from 'vue-router';
import PageHeader from '@/components/commons/PageHeader.vue';

const route = useRoute();

const HEADER_BUTTON_OPTS = {
  text: 'ADD NEW SUBJECT',
  flat: true,
};
</script>

<template lang="pug">
page-header(
  :title="route.meta.title"
  :button-opts="HEADER_BUTTON_OPTS"
)
</template>
