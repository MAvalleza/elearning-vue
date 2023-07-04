<script setup>
import AppLoader from '@/components/commons/AppLoader.vue';
import AuthFormCard from '@/components/auth/AuthFormCard.vue';
import { FORGOT_PASSWORD_FORM } from '@/constants/auth-form/form-fields';
import { useUI } from '@/stores/ui';
import { useAuth } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const uiStore = useUI();
const { loading } = storeToRefs(uiStore);

const authStore = useAuth();

async function requestReset(data) {
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
v-container
  app-loader(:is-visible="loading")

  v-row(justify="center")
    v-col(cols="12" lg="6" xl="4")
      auth-form-card(v-bind="FORGOT_PASSWORD_FORM" @submit="requestReset")

    //- NOTE: Since we are just mocking the backend, we just provide a button here that the user would normally see in an email.
    div(v-if="showTempLink")
      v-btn(@click="proceed") Proceed to reset
</template>
