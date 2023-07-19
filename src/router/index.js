import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuth as authStore } from '@/stores/auth';
import RegistrationPage from '@/pages/auth/RegistrationPage.vue';
import LoginPage from '@/pages/auth/LoginPage.vue';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage.vue';
import ChangePasswordPage from '@/pages/auth/ChangePasswordPage.vue';
import AccountActivationPage from '@/pages/auth/AccountActivationPage.vue';
import SubjectsListPage from '@/pages/subjects/SubjectsListPage.vue';
import CreateSubjectPage from '@/pages/subjects/CreateSubjectPage.vue';
import EditSubjectPage from '@/pages/subjects/EditSubjectPage.vue';
import CoursesListPage from '@/pages/courses/CoursesListPage.vue';
import CreateCoursePage from '@/pages/courses/CreateCoursePage.vue';
import activityWatcher from '@/plugins/activity-watcher';

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
  {
    path: '/subjects',
    name: 'subjects',
    meta: {
      auth: true,
      layout: 'AppLayout',
    },
    redirect: { name: 'subjects-list' },
    children: [
      {
        path: '',
        name: 'subjects-list',
        meta: { title: 'Subjects' },
        component: SubjectsListPage,
      },
      {
        path: 'create',
        name: 'create-subject',
        meta: { title: 'Add Subject' },
        component: CreateSubjectPage,
      },
      {
        path: '/subjects/:id',
        name: 'edit-subject',
        meta: { title: 'Edit Subject' },
        component: EditSubjectPage,
      },
      {
        path: '/subjects/:id/create-course',
        name: 'subject-create-course',
        meta: { title: 'Add a course' },
        component: CreateCoursePage,
      }
    ],
  },
  {
    path: '/courses',
    name: 'courses',
    meta: {
      auth: true,
      layout: 'AppLayout',
    },
    redirect: { name: 'courses-list' },
    children: [
      {
        path: '',
        name: 'courses-list',
        meta: { title: 'Courses' },
        component: CoursesListPage,
      },
      {
        path: 'create',
        name: 'create-course',
        meta: { title: 'Add Course' },
        component: CreateCoursePage,
      },
    ],
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

router.afterEach(to => {
  if (to.meta.auth) {
    activityWatcher();
  }
});

export default router;
