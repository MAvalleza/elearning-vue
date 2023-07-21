// These are the route/endpoint handlers

import createAuthRoutes from './authRoutes';
import createSubjectRoutes from './subjectRoutes';
import createCourseRoutes from './courseRoutes';
import createModuleRoutes from './moduleRoutes';

const createRoutes = routeInstance => {
  createAuthRoutes(routeInstance);
  createSubjectRoutes(routeInstance);
  createCourseRoutes(routeInstance);
  createModuleRoutes(routeInstance);
};

export default createRoutes;
