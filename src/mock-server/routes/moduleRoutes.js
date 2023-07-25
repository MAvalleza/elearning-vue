import { Response } from 'miragejs';
import {
  evaluateParams,
  RelationshipFilter,
} from '../helpers/fetchParamsHelper';
import { AuthSession } from '../helpers/authHelper';
import has from 'lodash-es/has';

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

  routeInstance.put('/modules/:id', (schema, request) => {
    let id = request.params.id;
    let attrs = JSON.parse(request.requestBody);

    const token = request.requestHeaders['Authorization'];

    const authSession = new AuthSession(schema, token);

    if (!authSession.isAuthorized({ resource: 'modules', resourceId: id })) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request'] }
      );
    }

    const module = schema.modules.find(id);

    const updateKeys = ['title', 'isPublished', 'description'];

    // Pick attributes that are actually updated
    const attrsToUpdate = updateKeys.reduce((acc, key) => {
      if (has(attrs, key) && module.attrs[key] !== attrs[key]) {
        acc[key] = attrs[key];
      }
      return acc;
    }, {});

    return module.update({
      ...attrsToUpdate,
    });
  });

  routeInstance.del('/modules/:id', (schema, request) => {
    let id = request.params.id;

    const token = request.requestHeaders['Authorization'];

    const authSession = new AuthSession(schema, token);

    if (!authSession.isAuthorized({ resource: 'modules', resourceId: id })) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request'] }
      );
    }

    let module = schema.modules.find(id);

    // Delete the actual course
    module.destroy();

    return new Response(
      200,
      { some: 'header' },
      { deleted: id, resource: 'modules' }
    );
  });
};

export default createModuleRoutes;
