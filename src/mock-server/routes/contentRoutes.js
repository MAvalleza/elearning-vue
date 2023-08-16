import { Response } from 'miragejs';
import { AuthSession } from '../helpers/authHelper';
import { evaluateParams } from '../helpers/fetchParamsHelper';
import pick from 'lodash-es/pick';

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

    const moduleId = request.queryParams.module;
    let collection = schema.contents;

    if (moduleId) {
      collection = schema.contents.where({ moduleId });
    }

    const response = evaluateParams(schema, {
      collection,
      params: request.queryParams,
    });

    return new Response(200, { some: 'header' }, response);
  });

  routeInstance.post('/contents', (schema, request) => {
    const attrs = JSON.parse(request.requestBody);
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

  routeInstance.put('/contents/:id', (schema, request) => {
    const id = request.params.id;
    const attrs = JSON.parse(request.requestBody);

    const token = request.requestHeaders['Authorization'];

    const authSession = new AuthSession(schema, token);

    if (!authSession.isAuthorized({ resource: 'contents', resourceId: id })) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request'] }
      );
    }

    const content = schema.contents.find(id);

    const updated = pick(attrs, ['content']);

    return content.update(updated);
  });
};

export default createContentRoutes;
