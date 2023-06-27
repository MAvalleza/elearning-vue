<script setup>
import AppLoader from '@/components/commons/AppLoader.vue'
import UserAuthFormCard from '@/components/auth/UserAuthFormCard.vue';
import { REGISTRATION_FORM } from '@/constants/auth-form/form-fields';
import { ref } from 'vue';

const loading = ref(false);

function registerUser(data) {
  loading.value = true;
  console.log('user register', data);
}
</script>

<template lang="pug">
v-container
  v-row(justify="center")
    v-col(cols="12" lg="6" xl="4")
      user-auth-form-card(
        v-bind="REGISTRATION_FORM"
        @submit="registerUser"
      )
  app-loader(:is-visible="loading")
</template>
