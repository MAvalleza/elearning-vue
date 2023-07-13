<script setup>
import { ref } from 'vue';

const isDialogVisible = ref(false);

const dialogTitle = ref('');
const dialogMessage = ref('');
const buttonText = ref('');
const color = ref(null);

const resolveResponse = ref(() => { })
const rejectResponse = ref(() => { })

defineExpose({
  open
});

async function open({
  title = 'Confirm',
  message = 'Do you want to continue with this action?',
  primaryAction = 'Confirm',
  primaryColor
}) {
  dialogTitle.value = title;
  dialogMessage.value = message;
  buttonText.value = primaryAction;
  color.value = primaryColor;

  isDialogVisible.value = true;

  return new Promise((resolve, reject) => {
    resolveResponse.value = resolve;
    rejectResponse.value = reject;
  })
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
