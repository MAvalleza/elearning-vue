<script setup>
const props = defineProps({
  // Header height in px (omit 'px')
  height: {
    type: [String, Number],
    default: '200',
  },
  bgColor: {
    type: String,
    default: '#34bdeb',
  },
  fontColor: {
    type: String,
    default: 'white',
  },
  title: {
    type: String,
    default: '',
  },
  titleIcon: {
    type: String,
    default: 'mdi-bookshelf',
  },
  // Props for v-btn
  buttonOpts: {
    type: Object,
    default: () => ({}),
  },
});

const HEADER_STYLES = {
  height: `${props.height}px`,
  backgroundColor: props.bgColor,
  color: props.fontColor,
};
</script>

<template lang="pug">
div(:style="HEADER_STYLES").pt-8
  slot(name="content")
    v-container(fluid)
      v-row(align="center")
        v-col.d-flex
          slot(name="title")
            v-icon(:icon="props.titleIcon" size="x-large").pt-4
            h1.pl-3 {{ props.title }}
        v-spacer
        v-col(style="{ background-color: 'red'}").text-right
          slot(name="action-btn")
            v-btn(v-bind="buttonOpts")
</template>