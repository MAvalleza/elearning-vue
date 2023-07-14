import { Response } from 'miragejs';
import { evaluateParams } from '../helpers/paramsHelper';
import { AuthSession } from '../helpers/authHelper';

const createCourseRoutes = routeInstance => {
  routeInstance.get('/courses', (schema, request) => {
    const token = request.requestHeaders['Authorization'];

    const authSession = new AuthSession(schema, token);
  
    if (!authSession.isAuthorized()) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request']},
      );
    }

    const collection = schema.courses.where({ authorId: authSession.user().id });

    const { count, results } = evaluateParams(
      schema,
      {
        collection,
        params: request.queryParams
      }
    );

    return new Response(
      200,
      { some: 'header' },
      { count, results }
    );
  });
};

export default createCourseRoutes;
