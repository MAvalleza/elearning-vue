<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { NAV_ITEMS } from '@/constants/nav-items';

// ROUTE
const router = useRouter();

// AUTH
const authStore = useAuth();
const { currentUser }: { currentUser: Ref } = storeToRefs(authStore);

// UI STATES
const drawer = ref(true);

const USER_MENU_ITEMS = [
  {
    title: 'My Profile',
    icon: 'mdi-account-circle-outline',
    onClick: () => {
      router.push({
        name: 'profile',
        params: { userId: currentUser.value.id },
      });
    },
  },
  {
    title: 'Change Password',
    icon: 'mdi-lock',
    onClick: async () => {
      // TODO: Temporary mock implementation, normally we send email
      const { token } = await authStore.requestResetPassword({
        email: currentUser.value.email,
      });

      router.push({
        name: 'change-password',
        query: { token },
      });
    },
  },
  {
    title: 'Logout',
    icon: 'mdi-exit-to-app',
    onClick: () => {
      logout();
    },
  },
];

const navItems = ref(
  NAV_ITEMS.filter(item => item.roles.includes(currentUser.value?.role))
);

// LOGOUT ACTION
async function logout() {
  await authStore.logoutUser();
}
</script>

<template lang="pug">
v-navigation-drawer(
  v-model="drawer"
  location="left"
  color="#2D323E"
  width="268"
  theme="dark"
)
  template(#prepend)
    div.drawer-header.white--text.d-flex.pt-2
      img(src="../../assets/images/arcanys-logo-symbol.png" width="27" height="27").mt-2.ml-4
      h5.drawer-header-text.pt-3.pl-3 eLearning Portal
      v-spacer
      v-app-bar-nav-icon(
        color="white"
        variant="text"
        @click.stop="drawer = !drawer"
      )
  v-list(density="compact").drawer-list.pt-3
    v-list-subheader.drawer-list-subheader MANAGEMENT
    v-list-item(
      v-for="(item, key) in navItems"
      :key="key"
      :title="item.title"
      :to="{ name: item.route }"
      active-class="active-nav"
    ).drawer-list-item
      template(#prepend)
        v-icon(:icon="item.icon" size="small")
v-app-bar(color="#f0f0f0" theme="light")
  template(v-if="!drawer")
    v-app-bar-nav-icon(variant="text" @click.stop="drawer = !drawer")
    v-app-bar-title.text-h5
      router-link(:to="{ name: 'index' }").app-bar-title eLearning Portal
  template(#append)
    v-list(bg-color="#f0f0f0")#user-menu-activator
      v-list-item(
        :title="currentUser.email"
        append-icon="mdi-chevron-down"
      )
        // Note: There is no avatar/icon field included in the user endpoints so we just put a placeholder
        template(#prepend)
          v-icon(icon="mdi-account-circle" size="x-large")
    v-menu(activator="#user-menu-activator")
      v-list
        v-list-item(
          v-for="(item, index) in USER_MENU_ITEMS"
          :key="index"
          :title="item.title"
          @click="item.onClick"
        )
          template(#prepend)
            v-icon(:icon="item.icon" color="black")
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

.drawer-header-text,
.app-bar-title {
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  /* 150% */
  letter-spacing: 0.15px;
}

.drawer-list-subheader {
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  /* 171.429% */
  letter-spacing: 0.1px;
}

.drawer-list-item :deep(.v-list-item-title) {
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  /* 142.857% */
  letter-spacing: 0.25px;
}

.active-nav {
  background: var(--accent-400, #28b4f4);
}
</style>
