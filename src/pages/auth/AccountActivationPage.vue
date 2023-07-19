<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useUI } from '@/stores/ui';
import { useAuth } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const route = useRoute();

const uiStore = useUI();
const { loading } = storeToRefs(uiStore);

const isProcessDone = ref(false);
const isTokenActivated = ref(false);

const authStore = useAuth();

async function activateAccount() {
  const token = route.query.token;

  isTokenActivated.value = await authStore.activateAccount(token);

  if (isTokenActivated.value) {
    message.value = 'Your account has been activated successfully'
  } else {
    message.value = 'Your link is invalid or expired';
  }

  isProcessDone.value = true;
}

const message = ref('');
const email = ref(null);

onMounted(() => {
  activateAccount();
})
</script>

<template lang="pug">
v-container.fill-height.align-center
  app-loader(:loading="loading")

  v-row(v-if="isProcessDone" justify="center")
    v-col(cols="12" lg="6" xl="4")
      v-card
        v-card-item
          h3 Account Activation
        v-card-text
          | {{ message }}
          div(v-if="!isTokenActivated").mt-5
            v-text-field(
              v-model="email"
              variant="outlined"
              density="compact"
              label="Email"
            )
            v-btn(
              color="primary"
              density="compact"
            ) Resend

        v-card-actions(v-if="isTokenActivated")
          v-spacer
            v-btn(
              color="primary"
              :to="{ name: 'login' }"
            ) Proceed to Login
          v-spacer
</template>
