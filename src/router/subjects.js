import SubjectsListPage from '@/pages/subjects/SubjectsListPage.vue';
import CreateSubjectPage from '@/pages/subjects/CreateSubjectPage.vue';
import EditSubjectPage from '@/pages/subjects/EditSubjectPage.vue';
import CreateCoursePage from '@/pages/courses/CreateCoursePage.vue';

export default [
  {
    path: '/subjects',
    name: 'subjects',
    meta: {
      auth: true,
      layout: 'AppLayout',
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
        path: '/subjects/:id',
        name: 'edit-subject',
        meta: { title: 'Edit Subject' },
        component: EditSubjectPage,
      },
      {
        path: '/subjects/:id/create-course',
        name: 'subject-create-course',
        meta: { title: 'Add a course', from: 'subject' },
        component: CreateCoursePage,
      }
    ],
  },
]