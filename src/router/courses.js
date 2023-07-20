import CoursesListPage from '@/pages/courses/CoursesListPage.vue';
import CreateCoursePage from '@/pages/courses/CreateCoursePage.vue';

export default [
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