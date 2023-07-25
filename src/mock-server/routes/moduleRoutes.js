import { Response } from 'miragejs';
import {
  evaluateParams,
  RelationshipFilter,
} from '../helpers/fetchParamsHelper';
import { AuthSession } from '../helpers/authHelper';

const createModuleRoutes = routeInstance => {
  routeInstance.get('/modules', (schema, request) => {
    const token = request.requestHeaders['Authorization'];

    const authSession = new AuthSession(schema, token);

    if (!authSession.isAuthorized()) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request'] }
      );
    }

    const collection = schema.modules.where({
      ...(authSession.isInstructor() && { authorId: authSession.user().id }),
      ...(request.queryParams.duration && {
        duration: request.queryParams.duration,
      }),
      ...new RelationshipFilter(request.queryParams).params,
    });

    const { count, results } = evaluateParams(schema, {
      collection,
      params: request.queryParams,
    });

    return new Response(200, { some: 'header' }, { count, results });
  });

  routeInstance.post('/modules', (schema, request) => {
    let attrs = JSON.parse(request.requestBody);
    const token = request.requestHeaders['Authorization'];

    const authSession = new AuthSession(schema, token);

    if (!authSession.isAuthorized()) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request'] }
      );
    }

    const course = schema.courses.find(attrs.courseId);
    const author = schema.users.find(attrs.authorId);

    const data = {
      ...attrs,
      course,
      author,
      createdAt: Date.now(),
      updatedAt: null,
    };

    return schema.modules.create(data).attrs;
  });
};

export default createModuleRoutes;