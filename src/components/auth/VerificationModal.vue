<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  // Temporary prop for mocking purposes so we can redirect to activation page
  token: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'update:token']);

const token = computed({
  get() {
    return props.token;
  },
  set(val) {
    emit('update:token', val);
  },
});

const dialog = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});

// Resend email
const MAX_TIME_IN_SECONDS = 30;
const isResendTimerRunning = ref(false);
const timerCount = ref(MAX_TIME_IN_SECONDS);

const authStore = useAuth();

async function resend() {
  const response = await authStore.resendVerification({ email: props.email });
  token.value = response.token;

  timerCount.value = MAX_TIME_IN_SECONDS;
  isResendTimerRunning.value = true;

  let interval = setInterval(() => {
    timerCount.value--;
    if (timerCount.value === 0) {
      clearInterval(interval);
      isResendTimerRunning.value = false;
    }
  }, 1000);
}

// TODO: Temporary
const router = useRouter();

function redirectToActivation() {
  router.push({
    name: 'activate-account',
    query: { token: token.value },
  });
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
      v-spacer
      // TODO: Temporary redirect button
      v-btn(
        color="primary"
        @click="redirectToActivation"
      ) (temp) Activate
      v-btn(
        color="secondary"
        :disabled="isResendTimerRunning"
        @click="resend"
      ).text-none
        | Resend
        span(v-if="isResendTimerRunning") &nbsp;in {{ timerCount }}s
</template>
