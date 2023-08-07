import { ROLES } from '@/constants/roles-and-actions';
import AvailableCoursesPage from '@/pages/student/AvailableCoursesPage.vue';
// import EnrolledCoursesPage from '@/pages/student/EnrolledCoursesPage.vue';

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
        component: AvailableCoursesPage,
      },
      // {
      //   path: 'my-courses',
      //   name: 'enrolled-courses',
      //   meta: { title: 'My Courses' },
      //   component: EnrolledCoursesPage,
      // }
    ]
  }
];
