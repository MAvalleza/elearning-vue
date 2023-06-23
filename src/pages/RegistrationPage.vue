<script setup>
import UserAuthFormCard from '@/components/auth/UserAuthFormCard.vue';
import { REGISTRATION_FORM } from '@/constants/auth-form/form-fields';
</script>

<template lang="pug">
v-container
  v-row(justify="center")
    v-col(cols="12" lg="6" xl="4")
      user-auth-form-card(v-bind="REGISTRATION_FORM")
</template>
