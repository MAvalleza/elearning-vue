import { ROLES_LIST } from '@/constants/roles-and-actions';
import { REQUIRED_RULE } from '@/constants/validation-rules';

const REGISTRATION_FORM = {
  title: 'CREATE AN ACCOUNT',
  fields: [
    {
      component: 'v-select',
      componentOpts: {
        label: 'Role',
        variant: 'outlined',
        items: ROLES_LIST,
        validateOn: 'blur',
      }
    },
    {
      component: 'v-text-field',
      componentOpts: {
        label: 'Email',
        variant: 'outlined',
        rules: [REQUIRED_RULE],
        validateOn: 'blur',
      }
    },
    {
      component: 'v-text-field',
      componentOpts: {
        label: 'First Name',
        variant: 'outlined',
        rules: [REQUIRED_RULE],
        validateOn: 'blur',
      }
    },
    {
      component: 'v-text-field',
      componentOpts: {
        label: 'Last Name',
        variant: 'outlined',
        rules: [REQUIRED_RULE],
        validateOn: 'blur',
      }
    },
    {
      component: 'v-text-field',
      componentOpts: {
        label: 'Password',
        variant: 'outlined',
        type: 'password',
        rules: [REQUIRED_RULE],
        validateOn: 'blur',
      }
    },
    {
      component: 'v-text-field',
      componentOpts: {
        label: 'Confirm Password',
        variant: 'outlined',
        type: 'password'
      },
    },
  ],
  buttonOpts: {
    text: 'REGISTER',
    variant: 'elevated',
    color: 'primary',
    size: 'x-large',
    minWidth: '200',
  },
}

export {
  REGISTRATION_FORM,
}