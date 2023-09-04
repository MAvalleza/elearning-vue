import { Response } from 'miragejs';
import { evaluateParams } from '../helpers/fetchParamsHelper';
import { AuthSession } from '../helpers/authHelper';
import omit from 'lodash-es/omit';

const createUserRoutes = routeInstance => {
  routeInstance.get('/users', (schema, request) => {
    const token = request.requestHeaders['Authorization'];

    const authSession = new AuthSession(schema, token);

    // Only admins are allowed to fetch all users.
    const isAllowedToFetchAll = authSession.isAdmin() || request.queryParams.role;
    if (!isAllowedToFetchAll) {
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
      opts: {
        filter: {
          keywordKeys: ['firstName', 'lastName'],
        },
      },
    });

    response.data = response.data.map(item => mapUser(item.attrs));
    
    return new Response(200, { some: 'header' }, response);
  });

  routeInstance.patch('/users/:id', (schema, request) => {
    const userId = request.params.id;
    const attrs = JSON.parse(request.requestBody);

    const token = request.requestHeaders['Authorization'];

    const authSession = new AuthSession(schema, token);

    if (!authSession.isAdmin() && authSession.user().id !== userId) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request'] }
      );
    }

    const user = schema.users.find(userId);

    return user.update(attrs);
  });

  routeInstance.del('/users/:id', (schema, request) => {
    const id = request.params.id;

    const token = request.requestHeaders['Authorization'];

    const authSession = new AuthSession(schema, token);

    if (!authSession.isAdmin()) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request'] }
      );
    }

    const user = schema.users.find(id);

    // Delete the user
    user.subjects.forEach(subject => subject.destroy());
    user.courses.forEach(course => course.destroy());
    user.modules.forEach(mod => mod.destroy());
    user.contents.forEach(content => content.destroy());
    user.enrollments.forEach(enrollment => enrollment.destroy());
    user.destroy();

    return new Response(
      200,
      { some: 'header' },
      { deleted: id, resource: 'users' }
    );
  });
};

function mapUser(userData) {
  return {
    ...omit(userData, 'password'),
    normalizedName: `${userData.firstName || ''} ${userData.lastName || ''}`,
  };
}

export default createUserRoutes;
