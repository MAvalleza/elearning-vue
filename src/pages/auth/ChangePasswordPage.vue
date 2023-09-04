<script setup lang="ts">
import { useUI } from '@/stores/ui';
import { useAuth } from '@/stores/auth';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { REQUIRED_RULE } from '@/constants/validation-rules';
import AppLoader from '@/components/commons/AppLoader.vue';
import AuthFormCard from '@/components/auth/AuthFormCard.vue';

// ROUTE
const route = useRoute();

// UI HANDLERS
const uiStore = useUI();
const { loading } = storeToRefs(uiStore);

const CHANGE_PASSWORD_FORM = {
  title: 'SET PASSWORD',
  fields: [
    {
      value: 'password',
      component: 'v-text-field',
      componentOpts: {
        label: 'Password',
        variant: 'outlined',
        type: 'password',
        rules: [REQUIRED_RULE],
        validateOn: 'blur',
      },
    },
    {
      value: 'confirmPassword',
      component: 'v-text-field',
      componentOpts: {
        label: 'Confirm Password',
        variant: 'outlined',
        type: 'password',
        rules: [REQUIRED_RULE],
        validateOn: 'input',
      },
      ruleConfigs: [
        {
          type: 'match',
          opts: {
            key: 'confirmPassword',
            compareKey: 'password',
            message: 'Passwords must match.',
          },
        },
      ],
    },
  ],
  buttonOpts: {
    text: 'SAVE CHANGES',
    variant: 'elevated',
    color: 'primary',
    size: 'large',
    minWidth: '200',
  },
};

// AUTH OPERATIONS
const authStore = useAuth();

async function reset(data: { password: string }) {
  const token = route.query.token as string;

  await authStore.resetPassword(data, token);
}
</script>

<template lang="pug">
app-loader(:is-visible="loading")

v-row(justify="center")
  v-col(cols="12" lg="3")
    auth-form-card(v-bind="CHANGE_PASSWORD_FORM" @submit="reset")
</template>
