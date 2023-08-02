import { createRouter, createWebHashHistory } from 'vue-router';
import isEmpty from 'lodash-es/isEmpty';
import { useAuth as authStore } from '@/stores/auth';
import authRoutes from './auth';
import subjectRoutes from './subjects';
import courseRoutes from './courses';
import moduleRoutes from './modules';
import studentRoutes from './student';
import activityWatcher from '@/plugins/activity-watcher';
import { ROLES } from '@/constants/roles-and-actions';
import InProgressPage from '@/pages/temp/InProgressPage.vue';

const routes = [
  {
    path: '/',
    name: 'index',
    // eslint-disable-next-line no-unused-vars
    redirect: () => redirect(),
  },
  ...authRoutes,
  ...subjectRoutes,
  ...courseRoutes,
  ...moduleRoutes,
  ...studentRoutes,
  // TODO: Temporary, placeholder route. (TO REMOVE)
  {
    path: '/in-progress',
    meta: { layout: 'BlankLayout' },
    name: 'in-progress',
    component: InProgressPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Global navigation guard
// eslint-disable-next-line no-unused-vars
router.beforeResolve((to, from) => {
  // If authorized route and there is no user logged in
  const isUnauthorized = to.meta.auth && !authStore().isAuthenticated;

  const role = authStore().currentUserRole;
  // If the logged-in user's role is not allowed to access the page
  const isNotAllowed = !isEmpty(to.meta?.roles) && !to.meta.roles.includes(role);

  if (isUnauthorized) {
    return { name: 'login' };
  } else if (isNotAllowed) {
    return { name: from.name };
  }
});

router.afterEach(to => {
  if (to.meta.auth) {
    activityWatcher();
  }
});

function redirect() {
  const role = authStore().currentUser?.role;

  if ([ROLES.ADMIN, ROLES.INSTRUCTOR].includes(role)) {
    return { name: 'subjects' };
  } else if (role === ROLES.STUDENT) {
    return { name: 'available-courses' };
  } else {
    return { name: 'login' };
  }
}

export default router;
