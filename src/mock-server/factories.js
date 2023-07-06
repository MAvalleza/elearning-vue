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
      const subject = server.create('subject', {
        owner: user,
        title: 'Mathematics',
        isPublished: true,
        createdAt: 1687316226,
        updatedAt: null,
      });

      server.create('course', {
        author: user,
        subject,
        title: 'Math Course',
        description: 'A basic course',
        icon: 'some-icon',
        isPublished: true,
        createdAt: 1687316226,
        updatedAt: null,
      });
    }
  }),
};
