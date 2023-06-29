<script setup>
import AppLoader from '@/components/commons/AppLoader.vue'
import AuthFormCard from '@/components/auth/AuthFormCard.vue';
import { LOGIN_FORM } from '@/constants/auth-form/form-fields';
import { useUI } from '@/stores/ui';
import { useAuth } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const uiStore = useUI();
const { loading } = storeToRefs(uiStore);

const authStore = useAuth();
const router = useRouter();

async function login(data) {
  uiStore.setLoading(true);

  await authStore.loginUser(data)

  uiStore.setLoading(false);

  router.push({ name: 'index' });
}
</script>

<template lang="pug">
v-container
  app-loader(:is-visible="loading")

  v-row(justify="center")
    v-col(cols="12" lg="6" xl="4")
      auth-form-card(v-bind="LOGIN_FORM" @submit="login")
        template(#append-form)
          div.text-right
            v-btn(variant="text" size="x-small") Forgot Password
        template(#append-form-actions)
          v-col
            span OR
          router-link(to="/register") Create an account
</template>
