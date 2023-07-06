import { Response } from 'miragejs';

const createSubjectRoutes = routeInstance => {
  // TODO: Filters
  routeInstance.get('/subjects', (schema, request) => {
    const token = request.requestHeaders['Authorization'];

    const session = schema.sessions.findBy({ accessToken: token });

    if (!session) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authenticated to fulfill this request.'] }
      );
    }

    const user = schema.users.findBy({ email: session.email });

    if (!user) {
      return new Response(
        404,
        { some: 'header' },
        { errors: ['User does not exist.'] },
      );
    }

    return schema.subjects.where({ ownerId: user.id }).models;
  });
};

export default createSubjectRoutes;
