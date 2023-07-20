import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuth as authStore } from '@/stores/auth';
import authRoutes from './auth';
import subjectRoutes from './subjects';
import courseRoutes from './courses';
import moduleRoutes from './modules';
import activityWatcher from '@/plugins/activity-watcher';

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/subjects',
  },
  ...authRoutes,
  ...subjectRoutes,
  ...courseRoutes,
  ...moduleRoutes,
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

router.afterEach(to => {
  if (to.meta.auth) {
    activityWatcher();
  }
});

export default router;
