import { Factory } from 'miragejs';
import { SUBJECT_FIXTURES } from './fixtures';

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
      SUBJECT_FIXTURES.forEach(subject => {
        const createdSubject = server.create('subject', {
          owner: user,
          title: subject.title,
          isPublished: subject.isPublished,
          createdAt: subject.createdAt,
          updatedAt: subject.updatedAt,
        });

        subject.courses?.forEach(course => {
          const createdCourse = server.create('course', {
            author: user,
            subject: createdSubject,
            title: course.title,
            description: course.description,
            isPublished: course.isPublished,
            createdAt: course.createdAt,
            updatedAt: course.updatedAt,
          });

          course.modules.forEach(module => {
            server.create('module', {
              author: user,
              course: createdCourse,
              title: module.title,
              isPublished: module.isPublished,
              duration: module.duration,
              createdAt: module.createdAt,
              updatedAt: module.updatedAt,
            });
          });
        });
      });
    },
  }),
};
