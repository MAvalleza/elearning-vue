<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { useUsers } from '@/stores/users';
import { useAuth } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import PageHeader from '@/components/commons/PageHeader.vue';
import PageContent from '@/components/commons/PageContent.vue';
import AppLoader from '@/components/commons/AppLoader.vue';
import type { MappedUser } from '@/types/user';
import { REQUIRED_RULE } from '@/constants/validation-rules';
import { ROLES_LIST } from '@/constants/roles-and-actions';
import { USER_STATUS_LABELS } from '@/constants/statuses';

// ROUTE
const route = useRoute();

// AUTH
const authStore = useAuth();

// USER OPERATIONS
const userId: Ref = ref(route.params.userId);
const usersStore = useUsers();
const { currentFetchedUser, loadingUsers } = storeToRefs(usersStore);
const user = ref(<MappedUser>{});

async function fetchUser() {
  await usersStore.fetchUser(userId.value);

  user.value = { ...currentFetchedUser.value };
}

async function updateUser() {
  await usersStore.updateUser({
    id: userId.value,
    data: user.value,
  });
}

// UI states
const HEADER_BUTTON_OPTS = {
  text: 'SAVE',
  flat: true,
  style: { color: 'black' },
};

// INITIALIZATIONS
onMounted(async () => {
  await fetchUser();
});
</script>

<template lang="pug">
app-loader(:is-visible="loadingUsers")

page-header(
  :title="currentFetchedUser.normalizedName"
  :button-opts="HEADER_BUTTON_OPTS"
  title-icon="mdi-account-supervisor-circle-outline"
  @click="updateUser"
)

page-content
  v-form(ref="form")
    v-container(fluid)
      v-row
        v-col(cols="12" lg="6")
          v-text-field(
            v-model="user.firstName"
            variant="outlined"
            placeholder="First Name"
            label="First Name"
            :rules="[REQUIRED_RULE]"
          )

        v-col(cols="12" lg="6")
          v-text-field(
            v-model="user.lastName"
            variant="outlined"
            placeholder="Last Name"
            label="Last Name"
            :rules="[REQUIRED_RULE]"
          )

        v-col(cols="12" lg="6")
          v-text-field(
            v-model="user.email"
            label="Email"
            variant="outlined"
            :rules="[REQUIRED_RULE]"
          )

        v-col(cols="12" lg="6")
          v-select(
            v-model="user.role"
            label="Role"
            variant="outlined"
            item-title="text"
            item-value="value"
            :items="ROLES_LIST"
            :disabled="!authStore.isAdmin"
          )

        v-col(cols="12" lg="6")
          v-select(
            v-model="user.isActive"
            label="Status"
            variant="outlined"
            item-title="label"
            item-value="value"
            :items="USER_STATUS_LABELS"
            :disabled="!authStore.isAdmin"
          )
</template>
