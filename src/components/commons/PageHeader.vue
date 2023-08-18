<script setup lang="ts">
import GenericContainer from './GenericContainer.vue';

const props = defineProps({
  // Header height in px (omit 'px')
  height: {
    type: [String, Number],
    default: '180',
  },
  // Vuetify classes as value. Prefix with `bg-`
  bgColor: {
    type: String,
    default: 'bg-light-blue',
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
  // Set to true if you want to utilize the center section
  hasCenterSection: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click']);

const HEADER_STYLES = {
  minHeight: `${props.height}px`,
};

function defineHeaderClasses() {
  return ['page-header', props.bgColor];
}

function onButtonClick() {
  emit('click');
}
</script>

<template lang="pug">
div(:style="HEADER_STYLES" :class="defineHeaderClasses()").pt-8
  slot(name="content")
    generic-container
      v-row(align="center")
        v-col(:style="{ color: props.fontColor }").d-flex
          slot(name="title")
            v-icon(:icon="props.titleIcon" size="x-large")
            h1.pl-3.pt-1 {{ props.title }}
        template(v-if="hasCenterSection")
          v-col(cols="5").pt-4
            slot(name="center-section")
        v-col.text-right
          slot(name="action-btn")
            v-btn(v-bind="buttonOpts" @click="onButtonClick")
</template>

<style scoped>
.page-header h1 {
  font-family: 'Montserrat', 'sans-serif';
  font-size: 20px !important;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  /* 120% */
  letter-spacing: 0.15px;
}
</style>
