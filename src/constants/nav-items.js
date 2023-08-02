import { ROLES } from "./roles-and-actions";

const { ADMIN, INSTRUCTOR, STUDENT } = ROLES;

const NAV_ITEMS = [
  {
    title: 'Subjects',
    icon: 'mdi-bookshelf',
    route: 'subjects',
    roles: [ADMIN, INSTRUCTOR],
  },
  {
    title: 'Courses',
    icon: 'mdi-bookshelf',
    route: 'courses',
    roles: [ADMIN, INSTRUCTOR],
  },
  {
    title: 'Courses',
    icon: 'mdi-bookshelf',
    route: 'available-courses',
    roles: [STUDENT],
  },
  {
    title: 'Modules',
    icon: 'mdi-bookshelf',
    route: 'modules',
    roles: [ADMIN, INSTRUCTOR],
  },
];

export { NAV_ITEMS };
