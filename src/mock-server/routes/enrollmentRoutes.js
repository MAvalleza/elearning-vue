import { Response } from 'miragejs';
import { AuthSession } from '../helpers/authHelper';
import { evaluateParams } from '../helpers/fetchParamsHelper';
import omit from 'lodash-es/omit';

const createEnrollmentRoutes = routeInstance => {
  routeInstance.get('/enrollments', (schema, request) => {
    const token = request.requestHeaders['Authorization'];
    const params = request.queryParams;

    const authSession = new AuthSession(schema, token);

    if (!authSession.isStudent() && !authSession.isAdmin()) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request'] }
      );
    }

    const collection = schema.enrollments.where({
      userId: params.studentId,
    });

    // We evaluate the `join` parameter manually since we need to access multiple levels
    // The `evaluateParams` helper currently supports one level only.
    const response = evaluateParams(schema, {
      collection,
      params: omit(params, 'join'),
    });

    if (params.join?.includes('course')) {
      response.data = response.data.map(item => {
        return {
          ...item.attrs,
          course: {
            ...item.course.attrs,
            ...(params.join.includes('subject') && {
              subject: item.course.subject,
            }),
            ...(params.join.includes('author') && {
              author: item.course.author,
            }),
            ...(params.join.includes('modules') && {
              modules: item.course.modules.models,
            }),
          },
        };
      });
    }

    return new Response(200, { some: 'header' }, response);
  });
  routeInstance.post('/enrollments', (schema, request) => {
    const attrs = JSON.parse(request.requestBody);
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

    // Check if already enrolled
    if (schema.enrollments.findBy({ userId: authSession.user().id, courseId: attrs.courseId })) {
      return new Response(
        403,
        { some: 'header' },
        { errors: ['Course already enrolled'] }
      )
    }

    const data = {
      user: authSession.user(),
      course,
      createdAt: Date.now(),
      updatedAt: null,
    };

    return schema.enrollments.create(data).attrs;
  });

  routeInstance.del('/enrollments/:id', (schema, request) => {
    const id = request.params.id;

    const token = request.requestHeaders['Authorization'];

    const authSession = new AuthSession(schema, token);

    if (
      !authSession.isAuthorized({ resource: 'enrollments', resourceId: id })
    ) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request'] }
      );
    }

    const enrollment = schema.enrollments.find(id);

    // Delete associated enrollment modules
    enrollment.enrollmentModules.destroy();

    // Delete the actual enrollment
    enrollment.destroy();

    return new Response(
      200,
      { some: 'header' },
      { deleted: id, resource: 'enrollments' }
    );
  });

  routeInstance.get('/enrollments/:id', (schema, request) => {
    const enrollmentId = request.params.id;
    const token = request.requestHeaders['Authorization'];
    const params = request.queryParams;

    const authSession = new AuthSession(schema, token);

    if (!authSession.isStudent() && !authSession.isAdmin()) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request'] }
      );
    }

    const enrollment = schema.enrollments.find(enrollmentId);

    return mapEnrollment(enrollment, { params });
  });
};

function mapEnrollment(enrollment, { params }) {
  return {
    ...enrollment.attrs,
    ...(params.join.includes('course')) && {
      course: enrollment.course.attrs
    },
    ...(params.join.includes('subject') && {
      subject: enrollment.course.subject,
    }),
    ...(params.join.includes('modules') && {
      modules: enrollment.course.modules.filter(mod => mod.isPublished).models.map(mod => ({
        ...mod.attrs,
        content: mod.contents?.models?.[0],
      }))
    }),
  };
}

export default createEnrollmentRoutes;
