import { ROLES } from '@/constants/roles-and-actions';
import EnrollableCoursesPage from '@/pages/courses/EnrollableCoursesPage.vue';

export default [
  {
    path: '/student',
    meta: {
      auth: true,
      layout: 'AppLayout',
      roles: [ROLES.STUDENT]
    },
    redirect: { name: 'available-courses' },
    children: [
      {
        path: 'courses',
        name: 'available-courses',
        meta: { title: 'Courses' },
        component: EnrollableCoursesPage,
      },
    ]
  }
];
