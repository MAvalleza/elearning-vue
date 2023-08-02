// Mock Server

import { createServer } from 'miragejs';
import models from './models';
import seeder from './seeder';
import createRoutes from './routes';

const createMockServer = () => {
  let server = createServer({
    models, // entities and their relationships
    // Seed initial data
    seeds(server) {
      seeder(server);
    },
    routes() {
      this.namespace = import.meta.env.VITE_API_NAMESPACE;

      createRoutes(this);
    },
  });
  return server;
};

export default createMockServer;
