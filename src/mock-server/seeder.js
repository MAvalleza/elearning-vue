import { SUBJECT_FIXTURES } from './fixtures';
import { ROLES } from '@/constants/roles-and-actions';

export default function seeder(server) {
  // Create instructor
  const instructor = server.create('user', {
    email: 'tr@test',
    password: '123',
    firstName: 'Teacher',
    lastName: 'Test',
    role: ROLES.INSTRUCTOR,
    isActive: true,
    createdAt: Date.now(),
    updatedAt: null,
  });

  SUBJECT_FIXTURES.forEach(subject => {
    const createdSubject = server.create('subject', {
      owner: instructor,
      title: subject.title,
      isPublished: subject.isPublished,
      createdAt: subject.createdAt,
      updatedAt: subject.updatedAt,
    });

    subject.courses?.forEach(course => {
      const createdCourse = server.create('course', {
        author: instructor,
        subject: createdSubject,
        title: course.title,
        description: course.description,
        isPublished: course.isPublished,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      });

      course.modules.forEach(module => {
        server.create('module', {
          author: instructor,
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
