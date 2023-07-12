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
        { errors: ['You are not authenticated to fulfill this request']},
      );
    }

    let collection = schema.subjects.where({ ownerId: authSession.user().id });

    collection = evaluateParams(collection, request.queryParams);

    // TODO: Handle join

    return new Response(
      200,
      { some: 'header' },
      {
        count: collection.length,
        results: collection.models,
      }
    );
  });


  // routeInstance.post('/subjects', (schema, request) => {
  //   let attrs = JSON.parse(request.requestBody);


  // });
};

export default createSubjectRoutes;
