import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuth as authStore } from '@/stores/auth';
import SubjectsPage from '../pages/SubjectsPage.vue';
import RegistrationPage from '../pages/auth/RegistrationPage.vue';
import LoginPage from '../pages/auth/LoginPage.vue';
import activityWatcher from '../plugins/activity-watcher';

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/subjects',
  },
  {
    path: '/auth',
    meta: { layout: 'BlankLayout' },
    children: [
      {
        path: '/auth/register',
        name: 'registration',
        component: RegistrationPage,
      },
      {
        path: '/auth/login',
        name: 'login',
        component: LoginPage,
      },
    ],
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

router.afterEach((to) => {
  if (to.meta.auth) {
    activityWatcher();
  }
});

export default router;
