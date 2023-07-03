<script setup>
import AppLoader from '@/components/commons/AppLoader.vue';
import AuthFormCard from '@/components/auth/AuthFormCard.vue';
import VerificationModal from '@/components/auth/VerificationModal.vue';
import { REGISTRATION_FORM } from '@/constants/auth-form/form-fields';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuth } from '@/stores/auth';
import { useUI } from '@/stores/ui';

const authStore = useAuth();

// UI states
const uiStore = useUI();
const { loading } = storeToRefs(uiStore);
const isVerificationModalVisible = ref(false);

async function registerUser(data) {
  await authStore.registerUser(data);

  // Show verification modal
  isVerificationModalVisible.value = true;
}
</script>

<template lang="pug">
v-container
  app-loader(:is-visible="loading")

  verification-modal(v-model="isVerificationModalVisible")

  v-row(justify="center")
    v-col(cols="12" lg="6" xl="4")
      auth-form-card(
        v-bind="REGISTRATION_FORM"
        @submit="registerUser"
      )
</template>
