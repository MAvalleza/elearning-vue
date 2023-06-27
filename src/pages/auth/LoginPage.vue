<script setup>
// import AppLoader from '@/components/commons/AppLoader.vue'
import AuthFormCard from '@/components/auth/AuthFormCard.vue';
import { LOGIN_FORM } from '@/constants/auth-form/form-fields';
</script>

<template lang="pug">
v-container
  //- app-loader(:is-visible="loading")

  v-row(justify="center")
    v-col(cols="12" lg="6" xl="4")
      auth-form-card(v-bind="LOGIN_FORM")
        template(#append-form)
          div.text-right
            v-btn(variant="text" size="x-small") Forgot Password
        template(#append-form-actions)
          v-col
            span OR
          router-link(to="/register") Create an account
</template>
