import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuth as authStore } from '@/stores/auth';
import SubjectsPage from '../pages/SubjectsPage.vue';
import RegistrationPage from '../pages/auth/RegistrationPage.vue';
import LoginPage from '../pages/auth/LoginPage.vue';

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/subjects',
  },
  {
    path: '/register',
    name: 'registration',
    meta: { layout: 'BlankLayout' },
    component: RegistrationPage,
  },
  {
    path: '/login',
    name: 'login',
    meta: { layout: 'BlankLayout' },
    component: LoginPage,
  },
  {
    path: '/subjects',
    name: 'subjects',
    meta: {
      auth: true,
      layout: 'AppLayout',
    },
    component: SubjectsPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Global navigation guard
router.beforeResolve((to, from, next) => {
  const isAuthenticated = authStore().isAuthenticated;

  if (to.meta.auth && !isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
