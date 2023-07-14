import createAuthRoutes from './authRoutes';
import createSubjectRoutes from './subjectRoutes';
import createCourseRoutes from './courseRoutes';

const createRoutes = routeInstance => {
  createAuthRoutes(routeInstance);
  createSubjectRoutes(routeInstance);
  createCourseRoutes(routeInstance);
};

export default createRoutes;
