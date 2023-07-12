import { Response } from 'miragejs';
import { evaluateParams } from '../helpers/paramsHelper';
import { AuthSession } from '../helpers/authHelper';


const createSubjectRoutes = routeInstance => {
  routeInstance.get('/subjects', (schema, request) => {
    const token = request.requestHeaders['Authorization'];

    const authSession = new AuthSession(schema, token);
  
    if (!authSession.isAuthorized()) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request']},
      );
    }

    const collection = schema.subjects.where({ ownerId: authSession.user().id });

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


  routeInstance.post('/subjects', (schema, request) => {
    let attrs = JSON.parse(request.requestBody);
    const token = request.requestHeaders['Authorization'];

    const authSession = new AuthSession(schema, token);
  
    if (!authSession.isAuthorized()) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request']},
      );
    }

    const data = {
      ...attrs,
      owner: authSession.user(),
      createdAt: Date.now(),
      updatedAt: null,
    };

    return schema.subjects.create(data);
  });

  routeInstance.get('/subjects/:id', (schema, request) => {
    let id = request.params.id;

    const token = request.requestHeaders['Authorization'];

    const authSession = new AuthSession(schema, token);

    if (!authSession.isAuthorized({ resource: 'subjects', resourceId: id })) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request']},
      );
    }

    return schema.subjects.find(id).attrs;
  });
};

export default createSubjectRoutes;
