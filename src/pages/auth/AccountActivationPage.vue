<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useUI } from '@/stores/ui';
import { useAuth } from '@/stores/auth';
import { storeToRefs } from 'pinia';

// ROUTE
const route = useRoute();

// UI HANDLER
const uiStore = useUI();
const { loading } = storeToRefs(uiStore);

const isProcessDone = ref(false);
const isTokenActivated = ref(false);

const message = ref('');

// AUTH OPERATIONS
const authStore = useAuth();

async function activateAccount() {
  const token = route.query.token as string;

  isTokenActivated.value = await authStore.activateAccount(token);

  if (isTokenActivated.value) {
    message.value = 'Your account has been activated successfully';
  } else {
    message.value = 'Your link is invalid or expired';
  }

  isProcessDone.value = true;
}
//
onMounted(() => {
  activateAccount();
});
</script>

<template lang="pug">
app-loader(:loading="loading")

v-row(v-if="isProcessDone" justify="center")
  v-col(cols="12" lg="6" xl="6")
    v-card
      v-card-item
        h3 Account Activation
      v-card-text
        | {{ message }}

      v-card-actions
        v-spacer
          v-btn(
            color="primary"
            :to="{ name: 'login' }"
          ) Login
        v-spacer
</template>
