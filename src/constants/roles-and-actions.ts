import capitalize from 'lodash-es/capitalize';

const ROLES = {
  ADMIN: 'admin',
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
};

const ROLES_LIST = Object.keys(ROLES).map((attr: string) => ({
  text: capitalize(ROLES[attr as keyof typeof ROLES]),
  value: ROLES[attr as keyof typeof ROLES],
}));

const ACTIONS = {
  USERS: {
    VIEW_ANY: 'users.view_any',
    VIEW_ANY_STUDENT: 'users.view_any_student',
    DELETE_ANY: 'users.delete_any',
  },
  SUBJECTS: {
    VIEW_ANY_UNPUBLISHED: 'subjects.view_any_unpublished',
    CREATE: 'subjects.create',
    UPDATE: 'subjects.update',
    DELETE_ANY: 'subjects.delete_any',
  },
  COURSES: {
    VIEW_ANY_UNPUBLISHED: 'courses.view_any_unpublished',
    CREATE: 'courses.create',
    UPDATE: 'courses.update',
    DELETE_ANY: 'courses.delete_any',
  },
  MODULES: {
    VIEW_ANY_UNPUBLISHED: 'modules.view_any_unpublished',
    CREATE: 'modules.create',
    UPDATE: 'modules.update',
    DELETE_ANY: 'modules.delete_any',
  },
  MODULE_CONTENTS: {
    VIEW_ANY_UNPUBLISHED: 'module_contents.view_any_unpublished',
    CREATE: 'module_contents.create',
    UPDATE: 'module_contents.update',
    DELETE_ANY: 'module_contents.delete_any',
  },
  ENROLLMENTS: {
    CREATE: 'enrollments.create',
    VIEW: 'enrollments.view',
    UPDATE: 'enrollments.update',
    DELETE_ANY: 'enrollments.delete_any',
  },
};

export { ROLES, ROLES_LIST, ACTIONS };
