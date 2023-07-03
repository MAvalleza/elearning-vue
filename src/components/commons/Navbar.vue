<script setup>
import { ref } from 'vue';
import { useAuth } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuth();
const { currentUser } = storeToRefs(authStore);

const drawer = ref(true);

async function logout() {
  await authStore.logoutUser();
}

const USER_MENU_ITEMS = [
  {
    title: 'My Profile',
    onClick: () => { },
  },
  {
    title: 'Change Password',
    onClick: () => { },
  },
  {
    title: 'Logout',
    onClick: () => {
      logout();
    },
  },
];
</script>

<template lang="pug">
v-navigation-drawer(
  v-model="drawer"
  location="left"
  color="grey"
  width="350"
)
  template(#prepend)
    div.drawer-header.white--text.d-flex.pt-2
      h5.text-h5.pt-2.pl-3 eLearning Portal
      v-spacer
      v-app-bar-nav-icon(color="white" variant="text" @click.stop="drawer = !drawer")
v-app-bar(color="primary")
  template(v-if="!drawer")
    v-app-bar-nav-icon(color="white" variant="text" @click.stop="drawer = !drawer")
    v-app-bar-title.text-h5
      router-link(:to="{ name: 'index' }").app-bar-title.font-weight-bold eLearning Portal
  template(#append)
    v-list(bg-color="primary")#user-menu-activator
      v-list-item(
        :title="currentUser.email"
        append-icon="mdi-chevron-down"
      )
    v-menu(activator="#user-menu-activator")
      v-list
        v-list-item(
          v-for="(item, index) in USER_MENU_ITEMS"
          :key="index"
          @click="item.onClick"
        )
          v-list-item-title {{ item.title }}
</template>

<style scoped>
.app-bar-title {
  color: white !important;
}

.drawer-header {
  background-color: black;
  height: 64px;
  color: white;
}
</style>
