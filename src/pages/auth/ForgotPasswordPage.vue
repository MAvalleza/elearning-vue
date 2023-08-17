<script setup lang="ts">
import { useUI } from '@/stores/ui';
import { useAuth } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { EMAIL_FORMAT_RULE, REQUIRED_RULE } from '@/constants/validation-rules';
import type { PasswordRequest } from '@/types/auth';
import AppLoader from '@/components/commons/AppLoader.vue';
import AuthFormCard from '@/components/auth/AuthFormCard.vue';

const uiStore = useUI();
const { loading } = storeToRefs(uiStore);

const authStore = useAuth();

const FORGOT_PASSWORD_FORM = {
  title: 'RECOVER YOUR PASSWORD',
  fields: [
    {
      value: 'email',
      component: 'v-text-field',
      componentOpts: {
        label: 'Email',
        variant: 'outlined',
        rules: [REQUIRED_RULE, EMAIL_FORMAT_RULE],
        validateOn: 'blur',
      },
    },
  ],
  buttonOpts: {
    text: 'SEND RESET LINK',
    variant: 'elevated',
    color: 'primary',
    size: 'large',
    minWidth: '200',
  },
};

async function requestReset(data: PasswordRequest) {
  const response = await authStore.requestResetPassword(data);

  // TODO: Temporary mocks since we do not send an actual email yet.
  if (response?.token) {
    token.value = response.token;
    showTempLink.value = true;
  }
}

// -- TODO: Temporary to mock reset password --
const showTempLink = ref(false);
const token = ref(null);
const router = useRouter();

function proceed() {
  router.push({
    name: 'change-password',
    query: { token: token.value },
  });
}
</script>

<template lang="pug">
app-loader(:is-visible="loading")

v-row(justify="center")
  v-col(cols="12" lg="3")
    auth-form-card(v-bind="FORGOT_PASSWORD_FORM" @submit="requestReset")

    //- NOTE: Since we are just mocking the backend, we just provide a button here that the user would normally see in an email.
    div(v-if="showTempLink").mt-10.text-center
      v-btn(@click="proceed") (temp) Proceed to reset
</template>
