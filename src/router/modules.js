import ModulesListPage from '@/pages/modules/ModulesListPage.vue';

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
    ],
  },
];
