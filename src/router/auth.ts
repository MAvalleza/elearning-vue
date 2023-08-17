import RegistrationPage from '@/pages/auth/RegistrationPage.vue';
import LoginPage from '@/pages/auth/LoginPage.vue';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage.vue';
import ChangePasswordPage from '@/pages/auth/ChangePasswordPage.vue';
import AccountActivationPage from '@/pages/auth/AccountActivationPage.vue';

export default [
  {
    path: '/auth',
    meta: { layout: 'AuthLayout' },
    children: [
      {
        path: 'register',
        name: 'registration',
        component: RegistrationPage,
      },
      {
        path: 'login',
        name: 'login',
        component: LoginPage,
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: ForgotPasswordPage,
      },
      {
        path: 'change-password',
        name: 'change-password',
        component: ChangePasswordPage,
      },
      {
        path: 'activate-account',
        name: 'activate-account',
        component: AccountActivationPage,
      },
    ],
  },
];
