import { Response } from 'miragejs';
import has from 'lodash-es/has';
import {
  evaluateParams,
  RelationshipFilter,
  CollectionJoin,
} from '../helpers/fetchParamsHelper';
import { AuthSession } from '../helpers/authHelper';

const createCourseRoutes = routeInstance => {
  routeInstance.get('/courses', (schema, request) => {
    const token = request.requestHeaders['Authorization'];

    const authSession = new AuthSession(schema, token);

    if (!authSession.isAuthorized()) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request'] }
      );
    }

    const collection = schema.courses.where({
      authorId: authSession.user().id, // TODO: Conditionally assign this according to permissions
      ...new RelationshipFilter(request.queryParams).params,
    });

    const { count, results } = evaluateParams(schema, {
      collection,
      params: request.queryParams,
    });

    return new Response(200, { some: 'header' }, { count, results });
  });

  routeInstance.post('/courses', (schema, request) => {
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

    const subject = schema.subjects.find(attrs.subjectId);
    const author = schema.users.find(attrs.authorId);

    const data = {
      ...attrs,
      subject,
      author,
      createdAt: Date.now(),
      updatedAt: null,
    };

    return schema.courses.create(data).attrs;
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
        { errors: ['You are not authorized to fulfill this request'] }
      );
    }

    const course = schema.courses.find(id);

    const updateKeys = [
      'title',
      'isPublished',
      'description',
      'icon'
    ];

    // Pick attributes that are actually updated
    const attrsToUpdate = updateKeys.reduce((acc, key) => {
      if (has(attrs, key) && course.attrs[key] !== attrs[key]) {
        acc[key] = attrs[key];
      }
      return acc;
    }, {})

    // Update subject model if applicable
    return course.update({
      ...attrsToUpdate,
      ...!!attrs.subjectId && { subject: schema.subjects.find(attrs.subjectId)}
    });
  });

  routeInstance.del('/courses/:id', (schema, request) => {
    let id = request.params.id;

    const token = request.requestHeaders['Authorization'];

    const authSession = new AuthSession(schema, token);

    if (!authSession.isAuthorized({ resource: 'courses', resourceId: id })) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request'] }
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
      { deleted: id, resource: 'courses' }
    );
  });

  routeInstance.get('/courses/:id', (schema, request) => {
    let id = request.params.id;

    const token = request.requestHeaders['Authorization'];

    const authSession = new AuthSession(schema, token);

    if (!authSession.isAuthorized({ resource: 'courses', resourceId: id })) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request'] }
      );
    }

    const course = schema.courses.find(id);

    if (!course) {
      return new Response(
        404,
        { some: 'header' },
        { errors: ['Course does not exist'] }
      );
    }

    // Apply join param to join collections
    return new CollectionJoin(schema, request.queryParams).join(
      course
    );
  });
};

export default createCourseRoutes;
