import { Response } from 'miragejs';
import { AuthSession } from '../helpers/authHelper';

const createEnrollmentRoutes = routeInstance => {
  routeInstance.post('/enrollments', (schema, request) => {
    let attrs = JSON.parse(request.requestBody);
    const token = request.requestHeaders['Authorization'];

    const authSession = new AuthSession(schema, token);

    if (!authSession.isStudent()) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request'] }
      );
    }

    const course = schema.courses.find(attrs.courseId);

    if (!course) {
      return new Response(
        404,
        { some: 'header' },
        { errors: ['Course does not exist'] }
      );
    }

    const data = {
      user: authSession.user(),
      course,
      createdAt: Date.now(),
      updatedAt: null,
    };

    return schema.enrollments.create(data).attrs;
  });
};

export default createEnrollmentRoutes;