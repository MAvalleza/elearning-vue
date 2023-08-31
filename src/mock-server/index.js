// Mock Server

import { createServer } from 'miragejs';
import models from './models';
import factories from './factories';
import createRoutes from './routes';
import { ROLES } from '../constants/roles-and-actions';
import userSerializer from './serializers/user';

const PERSISTENCE_KEY = 'mirageDb';

const createMockServer = ({ persistence }) => {
  if (!persistence) {
    localStorage.removeItem(PERSISTENCE_KEY)
  }

  let server = createServer({
    models, // entities and their relationships
    factories, // defines how to generate data
    // Seed initial data
    seeds(server) {
      const dbData = localStorage.getItem(PERSISTENCE_KEY);

      // If there is persisted data, we load that instead of seeding
      if (dbData) {
        // https://miragejs.com/api/classes/db/#load-data
        server.db.loadData(JSON.parse(dbData));
      } else {
        server.createList('user', 2).forEach(user => {
          server.createList('subject', 5, { owner: user }).forEach(subject => {
            server
              .createList('course', 6, { author: user, subject })
              .forEach(course => {
                server.createList('module', 3, {
                  author: user,
                  course,
                }).forEach(mod => {
                  server.createList('content', 1, {
                    module: mod,
                    author: user,
                    isPublished: mod.isPublished,
                    type: 'document',
                  })
                });
              });
          });
        });
        // Create admin
        server.create('user', {
          email: 'admin@test',
          password: '123',
          firstName: 'Admin',
          lastName: 'Account',
          role: ROLES.ADMIN,
          isActive: true,
          createdAt: Date.now(),
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
      }
    },
    serializers: {
      user: userSerializer,
    },
    routes() {
      this.namespace = import.meta.env.VITE_API_NAMESPACE;

      createRoutes(this);
    },
  });

  // Since MirageJS does not have an actual database,
  // we put persistence into localStorage
  if (persistence) {
    const mirageRequestHandler = server.pretender.handledRequest;
    server.pretender.handledRequest = (verb, path, request) => {
      if (!['get', 'head'].includes(verb.toLowerCase())) {
        localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(server.db.dump()));
      }
  
      mirageRequestHandler(verb, path, request);
    };
  }

  return server;
};

export default createMockServer;
