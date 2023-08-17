<template lang="pug">
v-container(fluid).fill-height.align-center.auth-bg
  router-view
</template>

<style scoped>
.auth-bg {
  background: url('../assets/images/auth-bg.png'), lightgray 50% / cover no-repeat;
}
</style>