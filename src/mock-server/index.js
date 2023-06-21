// Mock Server

import { createServer } from 'miragejs';
import models from './models';
import factories from './factories';

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

      this.get('/users');

      this.get('/users/:id', (schema, request) => {
        let id = request.params.id;

        return schema.users.find(id);
      })
    }

  });
  return server;
}

export default createMockServer;