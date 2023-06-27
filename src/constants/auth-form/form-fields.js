import { ROLES_LIST } from '@/constants/roles-and-actions';
import { REQUIRED_RULE } from '@/constants/validation-rules';

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
      }
    },
    {
      value: 'email',
      component: 'v-text-field',
      componentOpts: {
        label: 'Email',
        variant: 'outlined',
        rules: [REQUIRED_RULE],
        validateOn: 'blur',
      }
    },
    {
      value: 'firstName',
      component: 'v-text-field',
      componentOpts: {
        label: 'First Name',
        variant: 'outlined',
        rules: [REQUIRED_RULE],
        validateOn: 'blur',
      }
    },
    {
      value: 'lastName',
      component: 'v-text-field',
      componentOpts: {
        label: 'Last Name',
        variant: 'outlined',
        rules: [REQUIRED_RULE],
        validateOn: 'blur',
      }
    },
    {
      value: 'password', 
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
      value: 'confirmPassword',
      component: 'v-text-field',
      componentOpts: {
        label: 'Confirm Password',
        variant: 'outlined',
        type: 'password',
        rules: [REQUIRED_RULE],
        validateOn: 'blur'
      },
      ruleConfigs: [
        {
          type: 'match',
          opts: {
            key: 'confirmPassword',
            compareKey: 'password',
            message: 'Passwords must match.'
          },
        }
      ]
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