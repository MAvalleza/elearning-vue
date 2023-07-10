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
      const math = server.create('subject', {
        owner: user,
        title: 'Mathematics',
        isPublished: true,
        createdAt: 1687316226,
        updatedAt: null,
      });

      server.create('course', {
        author: user,
        subject: math,
        title: 'Math Course',
        description: 'A basic course',
        icon: 'some-icon',
        isPublished: true,
        createdAt: 1687316226,
        updatedAt: null,
      });

      server.create('course', {
        author: user,
        subject: math,
        title: 'Algebra',
        description: 'A basic algebra course',
        icon: 'some-icon',
        isPublished: true,
        createdAt: 1687316226,
        updatedAt: null,
      });

      const science = server.create('subject', {
        owner: user,
        title: 'Science',
        isPublished: true,
        createdAt: 1687316226,
        updatedAt: null,
      });

      server.create('course', {
        author: user,
        subject: science,
        title: 'Biology',
        description: 'A biological course',
        icon: 'some-icon',
        isPublished: true,
        createdAt: 1687316226,
        updatedAt: null,
      });

      server.create('subject', {
        owner: user,
        title: 'History',
        isPublished: false,
        createdAt: 1687316226,
        updatedAt: null,
      });
    }
  }),
};
