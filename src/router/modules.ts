import ModulesListPage from '@/pages/modules/ModulesListPage.vue';
import CreateModulePage from '@/pages/modules/CreateModulePage.vue';
import EditModulePage from '@/pages/modules/EditModulePage.vue';
import { ROLES } from '@/constants/roles-and-actions';

export default [
  {
    path: '/modules',
    name: 'modules',
    meta: {
      auth: true,
      layout: 'AppLayout',
      roles: [ROLES.ADMIN, ROLES.INSTRUCTOR],
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
      {
        path: '/modules/:moduleId',
        name: 'edit-module',
        meta: { title: 'Edit Module' },
        component: EditModulePage,
      },
    ],
  },
];
