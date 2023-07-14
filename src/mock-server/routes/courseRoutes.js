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

  routeInstance.put('/courses/:id', (schema, request) => {
    let id = request.params.id;
    let attrs = JSON.parse(request.requestBody);

    const token = request.requestHeaders['Authorization'];

    const authSession = new AuthSession(schema, token);

    if (!authSession.isAuthorized({ resource: 'courses', resourceId: id })) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request']},
      );
    }

    let course = schema.courses.find(id);

    return course.update(attrs);
  });

  routeInstance.del('/courses/:id', (schema, request) => {
    let id = request.params.id;

    const token = request.requestHeaders['Authorization'];

    const authSession = new AuthSession(schema, token);

    if (!authSession.isAuthorized({ resource: 'courses', resourceId: id })) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request']},
      );
    }

    let course = schema.courses.find(id);

    // Delete associated modules
    course.modules.destroy();

    // Delete the actual course
    course.destroy();

    return new Response(
      200,
      { some: 'header' },
      { deleted: id, resource: 'courses' },
    );
  });
};

export default createCourseRoutes;
