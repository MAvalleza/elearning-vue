// These are the route/endpoint handlers

import createAuthRoutes from './authRoutes';
import createSubjectRoutes from './subjectRoutes';
import createCourseRoutes from './courseRoutes';
import createModuleRoutes from './moduleRoutes';
import createContentRoutes from './contentRoutes';
import createEnrollmentRoutes from './enrollmentRoutes';

const createRoutes = routeInstance => {
  createAuthRoutes(routeInstance);
  createSubjectRoutes(routeInstance);
  createCourseRoutes(routeInstance);
  createModuleRoutes(routeInstance);
  createContentRoutes(routeInstance);
  createEnrollmentRoutes(routeInstance);
};

export default createRoutes;
