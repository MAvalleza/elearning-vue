import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import SubjectsPage from '../pages/SubjectsPage.vue';
import RegistrationPage from '../pages/auth/RegistrationPage.vue';
import LoginPage from '../pages/auth/LoginPage.vue';

const routes = [
  {
    path: '/',
    name: 'index',
    meta: { layout: 'BlankLayout' },
    component: HomePage,
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
    meta: { layout: 'AppLayout' },
    component: SubjectsPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
