<script setup>
import { getUsers } from '@/webservices/usersWebservice';

async function fetchUsers() {
  const data = await getUsers();

  console.log('data', data);
}
</script>

<template lang="pug">
v-container
  h1 I am the homepage

  v-btn(@click="fetchUsers") Click
</template>
