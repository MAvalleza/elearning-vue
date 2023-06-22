<script setup>
import { provide, shallowRef } from 'vue';
import router from './router';
import layouts from './constants/layouts';

const layout = shallowRef('div');

router.afterEach(to => {
  layout.value = layouts[to.meta.layout] || 'div';
});

provide('app:layout', layout);
</script>

<template lang="pug">
v-app
  v-main
    component(:is="layout")
      router-view
</template>
