import { useSubjects as subjectsStore } from '@/stores/subjects';
import { ROLES } from '@/constants/roles-and-actions';
import SubjectsListPage from '@/pages/subjects/SubjectsListPage.vue';
import CreateSubjectPage from '@/pages/subjects/CreateSubjectPage.vue';
import EditSubjectPage from '@/pages/subjects/EditSubjectPage.vue';
import CreateCoursePage from '@/pages/courses/CreateCoursePage.vue';
import EditCoursePage from '@/pages/courses/EditCoursePage.vue';
import CreateModulePage from '@/pages/modules/CreateModulePage.vue';
import EditModulePage from '@/pages/modules/EditModulePage.vue';
import BlankLayout from '@/layouts/Blank.vue';
import { type RouteLocationNormalized, type NavigationGuard } from 'vue-router';
import { type Subject } from '@/types/subject';

export default [
  {
    path: '/subjects',
    name: 'subjects',
    meta: {
      auth: true,
      layout: 'AppLayout',
      roles: [ROLES.ADMIN, ROLES.INSTRUCTOR],
    },
    redirect: { name: 'subjects-list' },
    children: [
      {
        path: '',
        name: 'subjects-list',
        meta: { title: 'Subjects' },
        component: SubjectsListPage,
      },
      {
        path: 'create',
        name: 'create-subject',
        meta: { title: 'Add Subject' },
        component: CreateSubjectPage,
      },
      {
        path: '/subjects/:subjectId',
        component: BlankLayout,
        children: [
          {
            path: '',
            component: BlankLayout,
            children: [
              {
                path: '',
                name: 'edit-subject',
                meta: { title: 'Edit Subject' },
                component: EditSubjectPage,
              },
              {
                path: 'courses',
                component: BlankLayout,
                children: [
                  {
                    path: 'create',
                    name: 'subject-create-course',
                    meta: { title: 'Add a course', from: 'subject' },
                    component: CreateCoursePage,
                    beforeEnter: [editSubjectGuard],
                  },
                  {
                    path: '/subjects/:subjectId/courses/:courseId',
                    component: BlankLayout,
                    children: [
                      {
                        path: '',
                        name: 'subject-edit-course',
                        meta: { title: 'Edit course', from: 'subject' },
                        component: EditCoursePage,
                        beforeEnter: [editSubjectGuard],
                      },
                      {
                        path: 'modules',
                        component: BlankLayout,
                        children: [
                          {
                            path: 'create',
                            name: 'subject-create-module',
                            meta: {
                              title: 'Add a module',
                              from: 'subject',
                            },
                            component: CreateModulePage,
                            beforeEnter: [editSubjectGuard],
                          },
                          {
                            path: '/subjects/:subjectId/courses/:courseId/modules/:moduleId',
                            name: 'subject-edit-module',
                            meta: { from: 'subject' },
                            component: EditModulePage,
                            beforeEnter: [editSubjectGuard],
                          },
                        ],
                      },
                    ],
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

function editSubjectGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: Parameters<NavigationGuard>[2]
) {
  // No bypassing allowed, `currentSubject` is updated in store when we access the main edit form first
  const subject = subjectsStore().currentSubject as Subject;
  if (to.params.subjectId !== subject.id) {
    next({ name: 'edit-subject', params: { subjectId: to.params.subjectId } });
  } else {
    next();
  }
}
