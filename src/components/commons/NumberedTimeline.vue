<script setup lang="ts">
interface Props {
  items: object[];
  titleKey: string; // atrribute of item to display as title
  activeKey: string; // attribute of item to compare with the selected key value
  activeKeyValue: string; // represents the value of the attribute of the selected item
}

const props = defineProps<Props>();

const emit = defineEmits(['select']);

function onItemClick(item: object, index: string) {
  emit('select', { item, index });
}
</script>

<template lang="pug">
v-list
  v-list-item(
    v-for="(item, index) in props.items"
    :key="index"
    :active="item[props.activeKey] === props.activeKeyValue"
    active-class="bg-light-blue-lighten-5"
    @click="onItemClick(item, index)"
  ).mb-5
    v-list-item-content
      v-hover
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
}

.text {
  font-size: 14px;
  line-height: 20px;
  /* 142.857% */
  letter-spacing: 0.25px;
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
  height: 70%;
  background-color: grey;
  z-index: 100;
}
</style>