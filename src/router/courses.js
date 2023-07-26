import { useCourses as coursesStore } from '@/stores/courses';
import CoursesListPage from '@/pages/courses/CoursesListPage.vue';
import CreateCoursePage from '@/pages/courses/CreateCoursePage.vue';
import CreateModulePage from '@/pages/modules/CreateModulePage.vue';
import EditCoursePage from '@/pages/courses/EditCoursePage.vue';
import BlankLayout from '@/layouts/Blank.vue';

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
        children: [
          {
            path: '',
            component: BlankLayout,
            children: [
              {
                path: '',
                name: 'edit-course',
                meta: { title: 'Edit Course', from: 'course' },
                component: EditCoursePage,
              },
              {
                path: 'modules',
                component: BlankLayout,
                children: [
                  {
                    path: 'create',
                    name: 'course-create-module',
                    meta: { title: 'Add a module', from: 'course' },
                    component: CreateModulePage,
                    beforeEnter: [editCourseGuard],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

function editCourseGuard(to, from, next) {
  // No bypassing allowed, `currentCourse` is updated in store when we access the main edit form first
  const course = coursesStore().currentCourse;
  if (to.params.courseId !== course.id) {
    next({ name: 'edit-course', params: { courseId: to.params.courseId } });
  } else {
    next();
  }
}
