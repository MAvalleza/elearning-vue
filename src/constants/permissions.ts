import { ACTIONS, ROLES } from './roles-and-actions';

const mappings = new Map();

const { ADMIN, INSTRUCTOR, STUDENT } = ROLES;

const { USERS, SUBJECTS, COURSES, MODULES, MODULE_CONTENTS, ENROLLMENTS } =
  ACTIONS;

// Users
mappings.set(USERS.VIEW_ANY, [ADMIN]);
mappings.set(USERS.VIEW_ANY_STUDENT, [ADMIN, INSTRUCTOR]);
mappings.set(USERS.DELETE_ANY, [ADMIN]);

// Subjects
mappings.set(SUBJECTS.VIEW_ANY_UNPUBLISHED, [ADMIN]);
mappings.set(SUBJECTS.CREATE, [INSTRUCTOR]);
mappings.set(SUBJECTS.UPDATE, [INSTRUCTOR]);
mappings.set(SUBJECTS.DELETE_ANY, [ADMIN]);

// Courses
mappings.set(COURSES.VIEW_ANY_UNPUBLISHED, [ADMIN]);
mappings.set(COURSES.CREATE, [INSTRUCTOR]);
mappings.set(COURSES.UPDATE, [INSTRUCTOR]);
mappings.set(COURSES.DELETE_ANY, [ADMIN]);

// Modules
mappings.set(MODULES.VIEW_ANY_UNPUBLISHED, [ADMIN]);
mappings.set(MODULES.CREATE, [INSTRUCTOR]);
mappings.set(MODULES.UPDATE, [INSTRUCTOR]);
mappings.set(MODULES.DELETE_ANY, [ADMIN]);

// Module Contents
mappings.set(MODULE_CONTENTS.VIEW_ANY_UNPUBLISHED, [ADMIN]);
mappings.set(MODULE_CONTENTS.CREATE, [INSTRUCTOR]);
mappings.set(MODULE_CONTENTS.UPDATE, [INSTRUCTOR]);
mappings.set(MODULE_CONTENTS.DELETE_ANY, [ADMIN]);

// Enrollments
mappings.set(ENROLLMENTS.CREATE, [STUDENT]);
mappings.set(ENROLLMENTS.VIEW, [ADMIN, STUDENT]);
mappings.set(ENROLLMENTS.UPDATE, [STUDENT]);
mappings.set(ENROLLMENTS.DELETE_ANY, [ADMIN]);

export default mappings;
