import { Factory } from 'miragejs';

export default {
  user: Factory.extend({
    email: '1@test',
    password: '123',
    firstName: 'Teacher',
    lastName: 'Test',
    role: 'instructor',
    isActive: true,
    createdAt: 1687316226,
    updatedAt: null,
    afterCreate(user, server) {
      server.create('subject', {
        owner: user,
        title: 'Mathematics',
        isPublished: true,
        createdAt: 1687316226,
        updatedAt: null,
      });
    }
  }),
};
