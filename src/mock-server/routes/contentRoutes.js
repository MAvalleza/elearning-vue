import { Response } from 'miragejs';
import { AuthSession } from '../helpers/authHelper';
import { evaluateParams } from '../helpers/fetchParamsHelper';

const createContentRoutes = routeInstance => {
  routeInstance.get('/contents', (schema, request) => {
    const token = request.requestHeaders['Authorization'];

    const authSession = new AuthSession(schema, token);

    if (!authSession.isAuthorized()) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request'] }
      );
    }

    const moduleId = request.queryParams.module
    let collection = schema.contents

    if (moduleId) {
      collection = schema.contents.where({ moduleId });
    }

    const { count, results } = evaluateParams(schema, {
      collection,
      params: request.queryParams,
    });

    return new Response(200, { some: 'header' }, { count, results });
  });

  routeInstance.post('/contents', (schema, request) => {
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

    const module = schema.modules.find(attrs.moduleId);

    const data = {
      type: attrs.type,
      content: attrs.content,
      author: module.author,
      module,
      createdAt: Date.now(),
      updatedAt: null,
    };

    return schema.contents.create(data).attrs;
  });

};

export default createContentRoutes;
