import { ROLES } from '@/constants/roles-and-actions';
import BlankLayout from '@/layouts/Blank.vue';
import AvailableCoursesPage from '@/pages/student/AvailableCoursesPage.vue';
import EnrolledCoursesPage from '@/pages/student/EnrolledCoursesPage.vue';
import ViewEnrolledCoursePage from '@/pages/student/ViewEnrolledCoursePage.vue';

export default [
  {
    path: '/student',
    meta: {
      auth: true,
      layout: 'AppLayout',
      roles: [ROLES.STUDENT],
    },
    redirect: { name: 'available-courses' },
    children: [
      {
        path: 'courses',
        name: 'available-courses',
        meta: { title: 'Courses' },
        component: AvailableCoursesPage,
      },
      {
        path: 'my-courses',
        component: BlankLayout,
        children: [
          {
            path: '',
            name: 'enrolled-courses',
            meta: { title: 'My Courses' },
            component: EnrolledCoursesPage,
          },
          {
            path: '/student/my-courses/:enrollmentId',
            name: 'view-enrolled-course',
            component: ViewEnrolledCoursePage,
          },
        ],
      },
    ],
  },
];
