<script setup lang="ts">
import { useAuth } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';

const authStore = useAuth();
const { currentUser } = storeToRefs(authStore);
</script>

<template lang="pug">
page-header(
  title="Profile"
  hide-button
)

page-content
  v-container
    v-col
      .name
        h3 Name
        p {{ currentUser.normalizedName }}
      .email.my-5
        h3 Email
        p {{ currentUser.email }}
      .role
        h3 Role
        p.text-capitalize {{ currentUser.role }}
</template>
