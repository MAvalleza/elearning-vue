import { faker } from '@faker-js/faker';
import { Response } from 'miragejs';

const createAuthRoutes = routeInstance => {
  routeInstance.get('/users');

  routeInstance.get('/users/:id', (schema, request) => {
    let id = request.params.id;

    return schema.users.find(id);
  });

  routeInstance.post('/signup', (schema, request) => {
    let attrs = JSON.parse(request.requestBody);

    const { email } = attrs;

    if (schema.users.findBy({ email })) {
      return new Response(
        403,
        { some: 'header' },
        { errors: ['User already exists'] },
      );
    }

    const USER_ID = faker.string.uuid();

    const data = {
      id: USER_ID,
      ...attrs,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: null,
    };

    return schema.users.create(data);
  });

  routeInstance.post('/login', (schema, request) => {
    const attrs = JSON.parse(request.requestBody);

    const { email, password } = attrs;

    const userData = schema.users.findBy({ email });

    if (userData?.password !== password) {
      return new Response(
        400,
        { some: 'header' },
        { errors: ['Email or password is incorrect.'] }
      );
    }

    const accessToken = faker.database.mongodbObjectId();

    localStorage.setItem('accessToken', accessToken);

    return {
      accessToken,
      email: userData.email,
      role: userData.role,
      firstName: userData.firstName,
      lastName: userData.lastName,
    };
  });

  routeInstance.delete('/logout', () => {
    localStorage.removeItem('accessToken');
  });
};

export default createAuthRoutes;
