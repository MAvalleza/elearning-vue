import {
  type RouteLocationNormalized,
  type RouteLocationRaw,
  createRouter,
  createWebHashHistory,
} from 'vue-router';
import 'vue-router';
import { useAuth as authStore } from '@/stores/auth';
import authRoutes from './auth';
import adminRoutes from './admin';
import subjectRoutes from './subjects';
import courseRoutes from './courses';
import moduleRoutes from './modules';
import studentRoutes from './student';
import activityWatcher from '@/plugins/activity-watcher';
import { ROLES } from '@/constants/roles-and-actions';
import UserProfilePage from '@/pages/user/UserProfilePage.vue';

declare module 'vue-router' {
  interface RouteMeta {
    roles?: string[]
  }

  interface RouteLocationNormalized {
    query: {
      token: string;
    }
  }
}

const routes = [
  {
    path: '/',
    name: 'index',
    component: { template: '<router-view />' }, // Dummy component
    beforeEnter: [rootRouteGuard],
  },
  {
    path: '/profile/:userId',
    name: 'profile',
    meta: { auth: true, layout: 'AppLayout' },
    component: UserProfilePage,
  },
  ...authRoutes,
  ...adminRoutes,
  ...subjectRoutes,
  ...courseRoutes,
  ...moduleRoutes,
  ...studentRoutes,
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

type BeforeResolveGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized
) => Promise<RouteLocationRaw | void>

const beforeResolveGuard: BeforeResolveGuard = async (to, from) => {
  // If there is not current user, we check for previously saved tokens
  if (!authStore().isAuthenticated) {
    await authStore().validateSession();
  } 
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
  }
}

// Global navigation guard
router.beforeResolve(beforeResolveGuard);

// To track user inactivity time
router.afterEach(to => {
  if (to.meta.auth) {
    activityWatcher();
  }
});

async function rootRouteGuard() {
   // If there is not current user, we check for previously saved tokens
   if (!authStore().isAuthenticated) {
    await authStore().validateSession();
  } 
  const role: string = authStore().currentUser.role;

  if (role === ROLES.ADMIN) {
    return { name: 'users' };
  } else if (role === ROLES.INSTRUCTOR) {
    return { name: 'subjects' };
  } else if (role === ROLES.STUDENT) {
    return { name: 'available-courses' };
  } else {
    return { name: 'login' };
  }
}

export default router;
