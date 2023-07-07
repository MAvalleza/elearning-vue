// Mock Server

import { createServer } from 'miragejs';
import models from './models';
import factories from './factories';
import createRoutes from './routes';

const createMockServer = () => {
  let server = createServer({
    models,
    factories,

    // Seed initial data
    seeds(server) {
      server.create('user');
    },
    routes() {
      this.namespace = import.meta.env.VITE_API_NAMESPACE;

      createRoutes(this);
    },
  });
  return server;
};

export default createMockServer;
