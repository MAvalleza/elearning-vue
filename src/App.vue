<script setup>
import { provide, shallowRef } from 'vue';
import router from './router';
import layouts from './constants/layouts';
import { storeToRefs } from 'pinia';
import { useUI } from '@/stores/ui';

const layout = shallowRef('div');

router.afterEach(to => {
  layout.value = layouts[to.meta.layout] || 'div';
});

provide('app:layout', layout);

const uiStore = useUI();
const { isSnackbarVisible, snackbar } = storeToRefs(uiStore);
</script>

<template lang="pug">
v-app
  v-main
    v-snackbar(v-model="isSnackbarVisible" :color="snackbar.color") {{ snackbar.message }}

    component(:is="layout")
      router-view
</template>
