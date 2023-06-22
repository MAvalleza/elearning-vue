import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

const USER_ID = faker.string.uuid();

export default {
  user: Factory.extend({
    id: USER_ID,
    email: 'teacher@test.com',
    password: 'password',
    firstName: 'Teacher',
    lastName: 'Test',
    role: 'instructor',
    isActive: true,
    createdAt: 1687316226,
    updatedAt: null,
  }),
};
