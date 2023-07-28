<script setup lang="ts">
import { ref, type Ref } from 'vue';

const isDialogVisible: Ref = ref(false);

const dialogTitle: Ref = ref('');
const dialogMessage: Ref = ref('');
const buttonText: Ref = ref('');
const color: Ref = ref(null);

const resolveResponse: Ref = ref(() => { });
const rejectResponse: Ref = ref(() => { });

defineExpose({
  open,
});

interface DialogOpts {
  title: string,
  message: string,
  primaryAction: string,
  primaryColor: string
}

async function open({
  title = 'Confirm',
  message = 'Do you want to continue with this action?',
  primaryAction = 'Confirm',
  primaryColor,
}: DialogOpts) {
  dialogTitle.value = title;
  dialogMessage.value = message;
  buttonText.value = primaryAction;
  color.value = primaryColor;

  isDialogVisible.value = true;

  return new Promise((resolve, reject) => {
    resolveResponse.value = resolve;
    rejectResponse.value = reject;
  });
}

function confirm() {
  resolveResponse.value(true);
  isDialogVisible.value = false;
}

function cancel() {
  resolveResponse.value(false);
  isDialogVisible.value = false;
}
</script>

<template lang="pug">
v-dialog(v-model="isDialogVisible" width="600" persistent)
  v-card
    v-toolbar(density="compact" :color="color")
      v-toolbar-title {{ dialogTitle }}
      v-spacer
      v-btn(icon="mdi-close" @click="cancel")
    v-card-text
      | {{ dialogMessage }}
    v-card-actions
      v-spacer
      v-btn(@click="cancel") Cancel
      v-btn(
        :color="color"
        variant="elevated"
        @click="confirm"
      )
        | {{ buttonText }}
</template>
