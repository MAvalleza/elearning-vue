<script setup>
import AppLoader from '@/components/commons/AppLoader.vue';
import AuthFormCard from '@/components/auth/AuthFormCard.vue';
import { CHANGE_PASSWORD_FORM } from '@/constants/auth-form/form-fields';
import { useUI } from '@/stores/ui';
import { useAuth } from '@/stores/auth';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

const uiStore = useUI();
const { loading } = storeToRefs(uiStore);

const route = useRoute();
const authStore = useAuth();

async function reset(data) {
  const token = route.query.token;

  await authStore.resetPassword(token, data);
}
</script>

<template lang="pug">
v-container
  app-loader(:is-visible="loading")

  v-row(justify="center")
    v-col(cols="12" lg="6" xl="4")
      auth-form-card(v-bind="CHANGE_PASSWORD_FORM" @submit="reset")
</template>
