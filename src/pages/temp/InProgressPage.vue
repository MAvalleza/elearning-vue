<template lang="pug">
v-container(fluid).fill-height.align-center
  v-row(justify="center")
    v-col(cols="12" lg="6" xl="6")
      v-card
        v-card-item
          h2 IN PROGRESS
        v-card-text
          | This feature / module is still under development.
        v-card-actions
          v-spacer
          v-btn(
            :to="{ name: 'index' }"
            color="primary"
            variant="elevated"
          ) Back to home
  </template>
