// Mock Server

import { createServer } from 'miragejs';
import models from './models';
import factories from './factories';
import createRoutes from './routes';
import { ROLES } from '@/constants/roles-and-actions';

const createMockServer = () => {
  let server = createServer({
    models, // entities and their relationships
    factories, // defines how to generate data
    // Seed initial data
    seeds(server) {
      server.createList('user', 2).forEach(user => {
        server.createList('subject', 5, { owner: user }).forEach(subject => {
          server
            .createList('course', 6, { author: user, subject })
            .forEach(course => {
              server.createList('module', 3, {
                author: user,
                course,
              });
            });
        });
      });

      // Create student
      server.create('user', {
        email: 's@test',
        password: '123',
        firstName: 'Student',
        lastName: 'Test',
        role: ROLES.STUDENT,
        isActive: true,
        createdAt: Date.now(),
      });
    },
    routes() {
      this.namespace = import.meta.env.VITE_API_NAMESPACE;

      createRoutes(this);
    },
  });
  return server;
};

export default createMockServer;
