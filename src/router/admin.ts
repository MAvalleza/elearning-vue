import { ROLES } from '@/constants/roles-and-actions';
import UsersListPage from '@/pages/admin/UsersListPage.vue';

export default [
  {
    path: '/admin',
    meta: {
      auth: true,
      layout: 'AppLayout',
      roles: [ROLES.ADMIN],
    },
    redirect: { name: 'users' },
    children: [
      {
        path: 'users',
        name: 'users',
        meta: { title: 'Users' },
        component: UsersListPage,
      },
    ],
  },
];
