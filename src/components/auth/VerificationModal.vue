<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue'])

const dialog = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
})

// Resend email
const MAX_TIME_IN_SECONDS = 30;
const isResendTimerRunning = ref(false)
const timerCount = ref(MAX_TIME_IN_SECONDS);

function resend() {
  timerCount.value = MAX_TIME_IN_SECONDS;
  isResendTimerRunning.value = true;

  let interval = setInterval(() => {
    timerCount.value--;
    if (timerCount.value === 0) {
      clearInterval(interval);
      isResendTimerRunning.value = false;
    }
  }, 1000)
}

function close() {
  emit('update:modelValue', false);
}

</script>

<template lang="pug">
v-dialog(v-model="dialog" width="auto" persistent)
  v-card
    v-toolbar(density="compact" color="white")
      v-spacer
      v-btn(icon="mdi-close" size="x-small" @click="close")
    v-card-text
      | A verification email has been sent.
    v-card-actions
      v-btn(
        color="primary"
        :disabled="isResendTimerRunning"
        block
        @click="resend"
      ).text-none
        | Resend
        span(v-if="isResendTimerRunning") &nbsp;in {{ timerCount }}s
</template>