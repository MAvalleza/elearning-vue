import {
  type RouteLocationNormalized,
  type RouteLocationRaw,
  createRouter,
  createWebHashHistory,
} from 'vue-router';
import 'vue-router';
import { useAuth as authStore } from '@/stores/auth';
import authRoutes from './auth';
import subjectRoutes from './subjects';
import courseRoutes from './courses';
import moduleRoutes from './modules';
import studentRoutes from './student';
import activityWatcher from '@/plugins/activity-watcher';
import { ROLES } from '@/constants/roles-and-actions';
import InProgressPage from '@/pages/temp/InProgressPage.vue';
import { type User } from '@/types/user';

const routes = [
  {
    path: '/',
    name: 'index',
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

declare module 'vue-router' {
  interface RouteMeta {
    roles?: string[]
  }
}

type BeforeResolveGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
) => RouteLocationRaw

const beforeResolveGuard: BeforeResolveGuard = (to, from) => {
  // If authorized route and there is no user logged in
  const isUnauthorized = to.meta.auth && !authStore().isAuthenticated;

  const role = authStore().currentUserRole;
  // If the logged-in user's role is not allowed to access the page
  const isNotAllowed =
      to.meta?.roles?.length && !to.meta.roles.includes(role);

  if (isUnauthorized) {
    return { name: 'login' };
  } else if (isNotAllowed && from?.name) {
    return { name: from.name };
  } else {
    return { name: 'login' };
  }
}

// Global navigation guard
router.beforeResolve(beforeResolveGuard);

router.afterEach(to => {
  if (to.meta.auth) {
    activityWatcher();
  }
});

function redirect() {
  const currentUser = authStore().currentUser as User;
  const role: string = currentUser.role;

  if ([ROLES.ADMIN, ROLES.INSTRUCTOR].includes(role)) {
    return { name: 'subjects' };
  } else if (role === ROLES.STUDENT) {
    return { name: 'available-courses' };
  } else {
    return { name: 'login' };
  }
}

export default router;
