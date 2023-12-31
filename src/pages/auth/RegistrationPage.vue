<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuth } from '@/stores/auth';
import { useUI } from '@/stores/ui';
import isEmpty from 'lodash-es/isEmpty';
import { EMAIL_FORMAT_RULE, REQUIRED_RULE } from '@/constants/validation-rules';
import { ROLES_LIST } from '@/constants/roles-and-actions';
import type { UserCreateParams } from '@/types/user';
import AppLoader from '@/components/commons/AppLoader.vue';
import AuthFormCard from '@/components/auth/AuthFormCard.vue';
import VerificationModal from '@/components/auth/VerificationModal.vue';

// UI HANDLERS
const uiStore = useUI();
const { loading } = storeToRefs(uiStore);
const isVerificationModalVisible = ref(false);

// Form data
const REGISTRATION_FORM = {
  title: 'CREATE AN ACCOUNT',
  fields: [
    {
      value: 'role',
      component: 'v-select',
      componentOpts: {
        label: 'Role',
        variant: 'outlined',
        items: ROLES_LIST,
        itemValue: 'value',
        itemTitle: 'text',
        rules: [REQUIRED_RULE],
        validateOn: 'blur',
      },
    },
    {
      value: 'email',
      component: 'v-text-field',
      componentOpts: {
        label: 'Email',
        variant: 'outlined',
        rules: [REQUIRED_RULE, EMAIL_FORMAT_RULE],
        appendInnerIcon: 'mdi-email-outline',
        validateOn: 'input',
      },
    },
    {
      value: 'firstName',
      component: 'v-text-field',
      componentOpts: {
        label: 'First Name',
        variant: 'outlined',
        rules: [REQUIRED_RULE],
        validateOn: 'blur',
      },
    },
    {
      value: 'lastName',
      component: 'v-text-field',
      componentOpts: {
        label: 'Last Name',
        variant: 'outlined',
        rules: [REQUIRED_RULE],
        validateOn: 'blur',
      },
    },
    {
      value: 'password',
      component: 'v-text-field',
      componentOpts: {
        label: 'Password',
        variant: 'outlined',
        type: 'password',
        rules: [REQUIRED_RULE],
        appendInnerIcon: 'mdi-key-outline',
        validateOn: 'blur',
      },
    },
    {
      value: 'confirmPassword',
      component: 'v-text-field',
      componentOpts: {
        label: 'Confirm Password',
        variant: 'outlined',
        type: 'password',
        rules: [REQUIRED_RULE],
        validateOn: 'input',
      },
      ruleConfigs: [
        {
          type: 'match',
          opts: {
            key: 'confirmPassword',
            compareKey: 'password',
            message: 'Passwords must match.',
          },
        },
      ],
    },
  ],
  buttonOpts: {
    text: 'REGISTER',
    variant: 'elevated',
    color: 'primary',
    size: 'large',
    minWidth: '200',
  },
};

// AUTH OPERATIONS
const authStore = useAuth();

// TODO: Temporary constant
const activationToken = ref(null);
const email = ref(null);

async function registerUser(data: UserCreateParams) {
  const response = await authStore.registerUser(data);

  if (isEmpty(response.errors)) {
    // Show verification modal
    email.value = response.email;
    activationToken.value = response.token;
    isVerificationModalVisible.value = true;
  }
}
</script>

<template lang="pug">
app-loader(:is-visible="loading")

verification-modal(
  v-model="isVerificationModalVisible"
  v-model:token="activationToken"
  :email="email"
)

v-row(justify="center")
  v-col(cols="12" lg="3")
    auth-form-card(
      v-bind="REGISTRATION_FORM"
      @submit="registerUser"
    )
</template>
