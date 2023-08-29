<script setup lang="ts">
interface Props {
  items?: object[];
  titleKey?: string;
}

const props = defineProps<Props>()
</script>

<template lang="pug">
v-list
  v-list-item(v-for="(item, index) in props.items" :key="index").mb-5
    v-list-item-content
      div.timeline-item
        div.number {{ index + 1 }}
        div.text.ml-3 {{ item[props.titleKey] }}
    div(v-if="index < props.items.length - 1").timeline-line
</template>

<style scoped>
.timeline-item {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.number {
  width: 30px;
  height: 30px;
  border: 1px solid black;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.timeline-line {
  position: absolute;
  top: 40px;
  left: 30px;
  width: 2px;
  height: 50%;
  background-color: grey;
  z-index: -1;
}
</style>