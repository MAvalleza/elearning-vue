<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useUsers } from '@/stores/users';
import { storeToRefs } from 'pinia';
import debounce from 'lodash-es/debounce';
import { REQUIRED_RULE } from '@/constants/validation-rules';
import { ROLES } from '@/constants/roles-and-actions';

interface Props {
  modelValue?: string | null;
  required?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  required: false,
  disabled: false,
});

const emit = defineEmits(['update:modelValue']);

const instructorId = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});

const instructorSearch = ref(null);

// Proceed with search when current search query is not equal to previous one
// And if there is no instructor selected
watch(instructorSearch, val => {
  val !== instructorId.value && !instructorId.value && searchInstructor(val);
});

const usersStore = useUsers();
const { users, loadingUsers } = storeToRefs(usersStore);

async function fetchUsers(keyword: string) {
  await usersStore.fetchUsers({ keyword, role: ROLES.INSTRUCTOR });
}

const searchInstructor = debounce(keyword => fetchUsers(keyword), 500);
</script>

<template lang="pug">
v-autocomplete(
  v-model="instructorId"
  v-model:search="instructorSearch"
  label="Instructor"
  variant="outlined"
  item-title="normalizedName"
  item-value="id"
  hide-no-data
  clearable
  :items="users"
  :loading="loadingUsers"
  :disabled="props.disabled"
  :rules="[props.required && REQUIRED_RULE]"
)
</template>
