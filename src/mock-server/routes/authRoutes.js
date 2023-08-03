import { faker } from '@faker-js/faker';
import { Response } from 'miragejs';
import { getTime, addDays } from 'date-fns';
import { evaluateParams } from '../helpers/fetchParamsHelper';
import { AuthSession } from '../helpers/authHelper';

const createAuthRoutes = routeInstance => {
  routeInstance.get('/users', (schema, request) => {
    const token = request.requestHeaders['Authorization'];

    const authSession = new AuthSession(schema, token);

    if (!authSession.isAuthorized()) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request'] }
      );
    }

    const collection = schema.users.where({
      ...request.queryParams.role && { role: request.queryParams.role }
    });

    const { count, results } = evaluateParams(schema, {
      collection,
      params: request.queryParams,
    });

    return new Response(200, { some: 'header' }, { count, results });
  });

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
        {
          errors: {
            name: 'existing-email',
            message: 'User already exists',
          },
        }
      );
    }

    const data = {
      ...attrs,
      isActive: false,
      createdAt: Date.now(),
      updatedAt: null,
    };

    // Create non-activated user
    schema.users.create(data);

    // Create activation token\
    const token = faker.database.mongodbObjectId();
    const tokenData = {
      token,
      email,
      createdAt: Date.now(),
      expiresAt: getTime(addDays(Date.now(), 1)),
      isExpired: false,
    };

    schema.activationTokens.create(tokenData);

    // Temporarily return activation token since we cannot send email yet
    return {
      email,
      token,
    };
  });

  routeInstance.post('/signup/verification', (schema, request) => {
    const attrs = JSON.parse(request.requestBody);

    let { email } = attrs;

    const user = schema.users.findBy({ email });

    if (!user) return;

    // Expire previous token if applicable
    const previousToken = schema.activationTokens.findBy({
      email,
      isExpired: false,
    });
    if (previousToken) {
      schema.db.activationTokens.update(
        { email, isExpired: false },
        { isExpired: true }
      );
    }

    // Create activation token
    const token = faker.database.mongodbObjectId();
    const tokenData = {
      token,
      email,
      createdAt: Date.now(),
      expiresAt: getTime(addDays(Date.now(), 1)),
      isExpired: false,
    };

    schema.activationTokens.create(tokenData);

    // Temporary to return token since we are mocking
    return { token };
  });

  routeInstance.get('/signup/verification', (schema, request) => {
    const { token } = request.queryParams;

    const tokenData = schema.activationTokens.findBy({ token });

    if (!tokenData) {
      return new Response(
        401,
        { some: 'header' },
        {
          errors: {
            name: 'invalid-token',
            message: 'Invalid token',
          },
        }
      );
    }

    if (tokenData.isExpired) {
      return new Response(
        403,
        { some: 'header' },
        {
          errors: {
            name: 'expired-token',
            message: 'Token has expired',
          },
        }
      );
    }

    if (tokenData.expiresAt < Date.now()) {
      // Set expired status
      schema.db.activationTokens.update({ token }, { isExpired: true });

      return new Response(
        403,
        { some: 'header' },
        {
          errors: {
            name: 'expired-token',
            message: 'Token has expired',
          },
        }
      );
    }

    // Activate user
    schema.db.users.update({ email: tokenData.email }, { isActive: true });
    // Set token to expired since it is used
    schema.db.activationTokens.update({ token }, { isExpired: true });
  });

  // NOTE: Login and logout are not the best implementations
  // But since this is a mock, we just simulate the process
  routeInstance.post('/login', (schema, request) => {
    const attrs = JSON.parse(request.requestBody);

    const { email, password } = attrs;

    const userData = schema.users.findBy({ email });

    if (userData?.password !== password) {
      return new Response(
        400,
        { some: 'header' },
        {
          errors: {
            name: 'invalid-credentials',
            message: 'Email or password is incorrect.',
          },
        }
      );
    }

    if (!userData.isActive) {
      return new Response(
        403,
        { some: 'header' },
        {
          errors: {
            name: 'unactivated-account',
            message: 'Your account is not activated.',
          },
        }
      );
    }

    const accessToken = faker.database.mongodbObjectId();

    const sessionUser = schema.sessions.create({
      accessToken,
      email: userData.email,
      role: userData.role,
      firstName: userData.firstName,
      lastName: userData.lastName,
    }).attrs;

    // Add id and normalized name then return
    return {
      ...sessionUser,
      id: userData.id,
      normalizedName: `${userData.firstName || ''} ${userData.lastName || ''}`,
    };
  });

  routeInstance.delete('/logout', (schema, request) => {
    const token = request.requestHeaders['Authorization'];

    schema.db.sessions.remove({ accessToken: token });
  });

  routeInstance.get('/password', (schema, request) => {
    const email = request.queryParams.email;

    if (!schema.users.findBy({ email })) {
      return new Response(
        404,
        { some: 'header' },
        {
          errors: {
            name: 'not-found-user',
            message: 'User does not exist.',
          },
        }
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
        {
          errors: {
            name: 'unauthorized',
            message: 'You are not authorized to fulfill this request',
          },
        }
      );
    }

    const user = schema.users.findBy({ email: resetRequest.email });

    schema.db.users.update(user.id, { password });

    schema.db.resetPasswordRequests.remove({ email: resetRequest.email });
  });
};

export default createAuthRoutes;
