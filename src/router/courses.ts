import { useCourses as coursesStore } from '@/stores/courses';
import CoursesListPage from '@/pages/courses/CoursesListPage.vue';
import CreateCoursePage from '@/pages/courses/CreateCoursePage.vue';
import EditCoursePage from '@/pages/courses/EditCoursePage.vue';
import CreateModulePage from '@/pages/modules/CreateModulePage.vue';
import EditModulePage from '@/pages/modules/EditModulePage.vue';
import BlankLayout from '@/layouts/Blank.vue';
import { ROLES } from '@/constants/roles-and-actions';
import { type RouteLocationNormalized, type NavigationGuard } from 'vue-router';
import { type Course } from '@/types/course';

export default [
  {
    path: '/courses',
    name: 'courses',
    meta: {
      auth: true,
      layout: 'AppLayout',
      roles: [ROLES.ADMIN, ROLES.INSTRUCTOR],
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
                  {
                    path: '/courses/:courseId/modules/:moduleId',
                    name: 'course-edit-module',
                    meta: { from: 'course' },
                    component: EditModulePage,
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

function editCourseGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: Parameters<NavigationGuard>[2]
) {
  // No bypassing allowed, `currentCourse` is updated in store when we access the main edit form first
  const course: Course = coursesStore().currentCourse;
  if (to.params.courseId !== course.id) {
    next({ name: 'edit-course', params: { courseId: to.params.courseId } });
  } else {
    next();
  }
}
