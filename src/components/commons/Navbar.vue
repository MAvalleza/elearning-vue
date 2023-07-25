<script setup>
import { ref } from 'vue';
import { useAuth } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { NAV_ITEMS } from '@/constants/nav-items';

const authStore = useAuth();
const { currentUser } = storeToRefs(authStore);

const drawer = ref(true);

async function logout() {
  await authStore.logoutUser();
}

const USER_MENU_ITEMS = [
  {
    title: 'My Profile',
    onClick: () => {},
  },
  {
    title: 'Change Password',
    onClick: () => {},
  },
  {
    title: 'Logout',
    onClick: () => {
      logout();
    },
  },
];

const navItems = ref(
  NAV_ITEMS.filter(item => item.roles.includes(currentUser.value.role))
);
</script>

<template lang="pug">
v-navigation-drawer(
  v-model="drawer"
  location="left"
  color="#2D323E"
  width="350"
  theme="dark"
)
  template(#prepend)
    div.drawer-header.white--text.d-flex.pt-2
      h5.text-h5.pt-2.pl-3 eLearning Portal
      v-spacer
      v-app-bar-nav-icon(color="white" variant="text" @click.stop="drawer = !drawer")
  v-list(density="compact")
    v-list-subheader MANAGEMENT
    v-list-item(
      v-for="(item, key) in navItems"
      :key="key"
      :title="item.title"
      :prepend-icon="item.icon"
      :to="{ name: item.route }"
    )
v-app-bar(color="#f0f0f0" theme="light")
  template(v-if="!drawer")
    v-app-bar-nav-icon(variant="text" @click.stop="drawer = !drawer")
    v-app-bar-title.text-h5
      router-link(:to="{ name: 'index' }").app-bar-title.font-weight-bold eLearning Portal
  template(#append)
    v-list(bg-color="#f0f0f0")#user-menu-activator
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
  color: black;
}

.drawer-header {
  background-color: black;
  height: 64px;
  color: white;
}
</style>
