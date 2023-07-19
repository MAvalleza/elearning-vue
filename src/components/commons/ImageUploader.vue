<script setup>
import { ref, computed } from 'vue';
import isEmpty from 'lodash-es/isEmpty';

const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: 'Upload',
  },
});

const emit = defineEmits(['update:modelValue']);

const image = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});

const uploader = ref(null);
const uploading = ref(false);

function changeFile() {
  uploader.value.click();
}

function uploadImage(e) {
  if (isEmpty(e.target.files)) {
    throw new Error('No file selected');
  }
  console.log('changed');
  const file = e.target.files[0];
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
        span(v-else) {{ props.label }}
    input(
      ref="uploader"
      hidden
      type="file"
      accept="image/*"
      @change="uploadImage"
    )
</template>
