<script setup lang="ts">
import { ref, computed, type Ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: 'Upload',
  },
  // Prevent uploading
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const image: Ref = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});

const uploader: Ref = ref(null);
const uploading = ref(false);

function changeFile() {
  if (props.disabled) return;

  uploader.value.click();
}

function uploadImage(e: Event) {
  const file = (e.target as HTMLInputElement)?.files?.[0];

  if (!file) {
    throw new Error('No file selected');
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.addEventListener('load', () => {
    image.value = reader.result;
  });
}
</script>

<template lang="pug">
v-card(
  height="200"
  width="200"
  @click="changeFile"
).pa-1
  v-img(:src="image").fill-height.text-center
    template(#placeholder)
      div(style="background-color: #f0f0f0;").d-flex.fill-height.align-center.justify-center
        v-progress-circular(v-if="uploading" color="grey-lighten-4" indeterminate)
        div(v-else).d-flex.flex-column.align-center
          v-icon(icon="mdi-image-plus" size="x-large")
          | {{ props.label }}
    input(
      ref="uploader"
      hidden
      type="file"
      accept="image/*"
      @change="uploadImage"
    )
</template>
