import { faker } from '@faker-js/faker';

const createUserRoutes = routeInstance => {
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
};

export default createUserRoutes;
