import CoursesListPage from '@/pages/courses/CoursesListPage.vue';
import CreateCoursePage from '@/pages/courses/CreateCoursePage.vue';
import EditCoursePage from '@/pages/courses/EditCoursePage.vue';

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
      {
        path: '/courses/:courseId',
        name: 'edit-course',
        meta: { title: 'Edit Course' },
        component: EditCoursePage,
      },
    ],
  },
];
