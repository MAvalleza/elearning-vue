<script setup lang="ts">
interface Action {
  icon: object;
  title: string;
  action: string;
}

interface Props {
  actions: Action[];
}
/**
 * @param {Object[]} actions[]
 * @param {Object} actions[].icon - v-icon props
 * @param {String} actions[].title - text for the action item
 * @param {String} actions[].action - action event
 */
const props = withDefaults(defineProps<Props>(), {
  actions: () => [],
});

const emit = defineEmits(['action']);

function onClick(item: Action) {
  emit('action', item.action);
}
</script>

<template lang="pug">
v-btn(
  variant="flat"
  icon
)
  v-icon mdi-dots-vertical
  v-menu(activator="parent")
    v-list
      v-list-item(
        v-for="(item, key) in props.actions"
        :key="key"
        @click="onClick(item)" 
      )
        template(#prepend)
          v-icon(v-bind="item.icon")
        v-list-item-title {{ item.title }}
</template>
