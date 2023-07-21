import ModulesListPage from '@/pages/modules/ModulesListPage.vue';
import CreateModulePage from '@/pages/modules/CreateModulePage.vue';

export default [
  {
    path: '/modules',
    name: 'modules',
    meta: {
      auth: true,
      layout: 'AppLayout',
    },
    redirect: { name: 'modules-list' },
    children: [
      {
        path: '',
        name: 'modules-list',
        meta: { title: 'Modules' },
        component: ModulesListPage,
      },
      {
        path: 'create',
        name: 'create-module',
        meta: { title: 'Add a module' },
        component: CreateModulePage,
      },
    ],
  },
];
