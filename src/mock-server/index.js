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
      this.namespace = '/api';

      createRoutes(this);
    },
  });
  return server;
};

export default createMockServer;
