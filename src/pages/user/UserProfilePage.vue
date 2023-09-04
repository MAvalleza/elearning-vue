<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { useUsers } from '@/stores/users';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import AppLoader from '@/components/commons/AppLoader.vue';

// Route
const route = useRoute();

// Users
const userId: Ref = ref(route.params.userId)
const usersStore = useUsers();
const { currentFetchedUser, loadingUsers } = storeToRefs(usersStore);

async function fetchUser() {
  await usersStore.fetchUser(userId.value);
}

// Initializations
onMounted(async () => {
  await fetchUser();
})
</script>

<template lang="pug">
app-loader(:is-visible="loadingUsers")

page-header(
  :title="currentFetchedUser.normalizedName"
  title-icon="mdi-account-supervisor-circle-outline"
  hide-button
)

page-content
  v-container
    v-col
      .name
        h3 Name
        p {{ currentFetchedUser.normalizedName }}
      .email.my-5
        h3 Email
        p {{ currentFetchedUser.email }}
      .role
        h3 Role
        p.text-capitalize {{ currentFetchedUser.role }}
</template>
