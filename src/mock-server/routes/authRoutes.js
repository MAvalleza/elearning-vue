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

    return schema.sessions.create({
      accessToken,
      id: faker.string.uuid(),
      email: userData.email,
      role: userData.role,
      firstName: userData.firstName,
      lastName: userData.lastName,
    }).attrs;
  });

  routeInstance.delete('/logout', schema => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'));

    localStorage.removeItem('accessToken');

    return schema.sessions.remove({ accessToken });
  });
};

export default createAuthRoutes;
