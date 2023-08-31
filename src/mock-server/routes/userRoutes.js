import { Response } from 'miragejs';
import { evaluateParams } from '../helpers/fetchParamsHelper';
import { AuthSession } from '../helpers/authHelper';

const createUserRoutes = routeInstance => {
  routeInstance.get('/users', (schema, request) => {
    const token = request.requestHeaders['Authorization'];

    const authSession = new AuthSession(schema, token);

    if (!authSession.isAdmin()) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request'] }
      );
    }

    const collection = schema.users.where({
      ...(request.queryParams.role && { role: request.queryParams.role }),
    });

    const response = evaluateParams(schema, {
      collection,
      params: request.queryParams,
    });

    return new Response(200, { some: 'header' }, response);
  });
};

export default createUserRoutes;
