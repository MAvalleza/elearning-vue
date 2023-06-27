import createAuthRoutes from './authRoutes';

const createRoutes = routeInstance => {
  createAuthRoutes(routeInstance);
};

export default createRoutes;
