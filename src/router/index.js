import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import SubjectsPage from '../pages/SubjectsPage.vue';

const routes = [
  {
    path: '/',
    name: 'index',
    meta: { layout: 'BlankLayout' },
    component: HomePage,
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
