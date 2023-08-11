<script setup lang="ts">
import { useUI } from '@/stores/ui';
import { useAuth } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { EMAIL_FORMAT_RULE, REQUIRED_RULE } from '@/constants/validation-rules';
import type { LoginCredentials } from '@/types/auth';
import AppLoader from '@/components/commons/AppLoader.vue';
import AuthFormCard from '@/components/auth/AuthFormCard.vue';

const uiStore = useUI();
const { loading } = storeToRefs(uiStore);

const authStore = useAuth();

const LOGIN_FORM = {
  title: 'LOGIN TO YOUR ACCOUNT',
  fields: [
    {
      value: 'email',
      component: 'v-text-field',
      componentOpts: {
        label: 'Email',
        variant: 'outlined',
        rules: [REQUIRED_RULE, EMAIL_FORMAT_RULE],
        validateOn: 'input',
      },
    },
    {
      value: 'password',
      component: 'v-text-field',
      componentOpts: {
        label: 'Password',
        variant: 'outlined',
        type: 'password',
        rules: [REQUIRED_RULE],
        validateOn: 'input',
      },
    },
  ],
  buttonOpts: {
    text: 'LOGIN',
    variant: 'elevated',
    color: 'primary',
    size: 'x-large',
    minWidth: '200',
  },
};

async function login(data: LoginCredentials) {
  await authStore.loginUser(data);
}

onMounted(() => {
  authStore.$reset();
});
</script>

<template lang="pug">
v-container(fluid).fill-height.align-center.bg-grey-darken-4
  app-loader(:is-visible="loading")

  v-row(justify="center")
    v-col(cols="12" lg="4")
      auth-form-card(v-bind="LOGIN_FORM" @submit="login")
        template(#append-form)
          div.text-right
            v-btn(variant="text" size="x-small" :to="{ name: 'forgot-password' }") Forgot Password
        template(#append-form-actions)
          v-col
            span OR
          router-link(:to="{ name: 'registration' }") Create an account
</template>
