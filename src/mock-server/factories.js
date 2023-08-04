import { Factory } from 'miragejs'
import { ROLES } from '@/constants/roles-and-actions';
import { faker } from '@faker-js/faker';

export default {
  user: Factory.extend({
    email(i) {
      return `tr${i + 1}@test`
    },
    password: '123',
    firstName(i) {
      return `Teacher${i + 1}`;
    },
    lastName: 'Test',
    role: ROLES.INSTRUCTOR,
    isActive: true,
    createdAt: Date.now(),
    updatedAt: null,
  }),
  subject: Factory.extend({
    title() {
      return `SUB ${faker.word.noun()}` ;
    },
    isPublished() {
      return faker.datatype.boolean();
    },
    createdAt: Date.now(),
    updatedAt: null,
  }),
  course: Factory.extend({
    title() {
      return `CRS ${faker.word.noun()}`;
    },
    description() {
      return faker.lorem.paragraph();
    },
    isPublished() {
      return faker.datatype.boolean();
    },
    createdAt: Date.now(),
    updatedAt: null,
  }),
  module: Factory.extend({
    title() {
      return `MOD ${faker.word.noun()}`;
    },
    isPublished() {
      return faker.datatype.boolean();
    },
    duration() {
      return faker.number.int({ min: 10, max: 200 });
    },
    createdAt: Date.now(),
    updatedAt: null,
  })
}