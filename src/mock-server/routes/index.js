import createAuthRoutes from './authRoutes';
import createSubjectRoutes from './subjectRoutes';

const createRoutes = routeInstance => {
  createAuthRoutes(routeInstance);
  createSubjectRoutes(routeInstance);
};

export default createRoutes;
