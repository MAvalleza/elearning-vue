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
        { errors: ['User already exists'] }
      );
    }

    const data = {
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

    return schema.sessions.create({
      accessToken,
      email: userData.email,
      role: userData.role,
      firstName: userData.firstName,
      lastName: userData.lastName,
    });
  });

  routeInstance.delete('/logout', (schema, request) => {
    const token = request.requestHeaders['Authorization'];

    schema.db.sessions.remove({ accessToken: token});
  });

  routeInstance.get('/password', (schema, request) => {
    const email = request.queryParams.email;

    if (!schema.users.findBy({ email })) {
      return new Response(
        404,
        { some: 'header' },
        { errors: ['User does not exist'] }
      );
    }

    const requestToken = faker.database.mongodbObjectId();

    const link = `${window.location.origin}/#/auth/change-password/?token=${requestToken}`;

    console.log('Mock email sent');
    console.log(link);

    schema.resetPasswordRequests.create({
      token: requestToken,
      email,
    });

    // TODO: Temporary (to remove).
    // Since we are only mocking, we return the link since we do not send an actual email.
    return { token: requestToken };
  });

  routeInstance.post('/password', (schema, request) => {
    const token = request.requestHeaders['Authorization'];
    const { password } = JSON.parse(request.requestBody);

    const resetRequest = schema.resetPasswordRequests.findBy({ token });

    if (!resetRequest) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authenticated to fulfill this request.'] }
      );
    }

    const user = schema.users.findBy({ email: resetRequest.email });

    schema.db.users.update(user.id, { password });

    schema.db.resetPasswordRequests.remove({ email: resetRequest.email });
  });
};

export default createAuthRoutes;
