<script setup>
import { useUI } from '@/stores/ui';
import { useAuth } from '@/stores/auth';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { REQUIRED_RULE } from '@/constants/validation-rules';
import AppLoader from '@/components/commons/AppLoader.vue';
import AuthFormCard from '@/components/auth/AuthFormCard.vue';

const uiStore = useUI();
const { loading } = storeToRefs(uiStore);

const route = useRoute();
const authStore = useAuth();

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
    size: 'x-large',
    minWidth: '200',
  },
};

async function reset(data) {
  const token = route.query.token;

  await authStore.resetPassword(data, token);
}
</script>

<template lang="pug">
v-container(fluid).fill-height.bg-grey-darken-4
  app-loader(:is-visible="loading")

  v-row(justify="center")
    v-col(cols="12" lg="4")
      auth-form-card(v-bind="CHANGE_PASSWORD_FORM" @submit="reset")
</template>
