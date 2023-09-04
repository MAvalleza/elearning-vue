import { Response } from 'miragejs';
import { AuthSession } from '../helpers/authHelper';
import { evaluateParams, Sorter } from '../helpers/fetchParamsHelper';
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

    response.data = response.data.map(item => mapEnrollment(item, { params }));

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
    if (
      schema.enrollments.findBy({
        userId: authSession.user().id,
        courseId: attrs.courseId,
      })
    ) {
      return new Response(
        403,
        { some: 'header' },
        { errors: ['Course already enrolled'] }
      );
    }

    const data = {
      user: authSession.user(),
      course,
      createdAt: Date.now(),
      updatedAt: null,
    };

    const enrollment = schema.enrollments.create(data);

    // Create enrollment modules for published modules
    const modules = course.modules.filter(mod => mod.isPublished).models;
    modules.forEach(mod => {
      schema.enrollmentModules.create({
        module: mod,
        enrollment,
        isCompleted: false,
      });
    });

    return enrollment.attrs;
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

  routeInstance.patch('/enrollments/:id', (schema, request) => {
    const enrollmentId = request.params.id;
    const token = request.requestHeaders['Authorization'];
    const { moduleId, isCompleted } = JSON.parse(request.requestBody);

    const authSession = new AuthSession(schema, token);

    if (!authSession.isStudent() && !authSession.isAdmin()) {
      return new Response(
        401,
        { some: 'header' },
        { errors: ['You are not authorized to fulfill this request'] }
      );
    }

    // Update enrollment module status
    const enrollment = schema.enrollments.find(enrollmentId);

    if (!enrollment) {
      return new Response(
        404,
        { some: 'header' },
        { errors: ['Enrollment does not exist'] }
      );
    }

    const enrollmentModule = schema.enrollmentModules.findBy({
      moduleId,
      enrollmentId,
    });

    // If no enrollment module, this is possibly a previously drafted module that was published
    // So we create the enrollment module
    if (!enrollmentModule) {
      const mod = schema.modules.find(moduleId);

      schema.enrollmentModules.create({
        module: mod,
        enrollment,
        isCompleted: true,
      });
    } else {
      schema.db.enrollmentModules.update(
        { moduleId, enrollmentId },
        { isCompleted }
      );
    }

    // Update date
    const updatedDate = Date.now();
    enrollment.update({ updatedAt: updatedDate });

    return {
      id: enrollmentId,
      userId: authSession.user().id,
      courseId: enrollment.course.id,
      modulesInProgress: schema.enrollmentModules.where({
        enrollmentId,
        isCompleted: false,
      }).models,
      completedModules: schema.enrollmentModules.where({
        enrollmentId,
        isCompleted: true,
      }).models,
      createdAt: enrollment.createdAt,
      updatedAt: updatedDate,
    };
  });
};

function mapEnrollment(enrollment, { params }) {
  const moduleSorter = new Sorter({ sort: 'createdAt', sortDirection: 'asc' });

  return {
    ...enrollment.attrs,
    ...(params.join.includes('course') && {
      course: enrollment.course.attrs,
    }),
    ...(params.join.includes('subject') && {
      subject: enrollment.course.subject,
    }),
    ...(params.join.includes('author') && {
      author: enrollment.course.author,
    }),
    ...(params.join.includes('modules') && {
      modules: enrollment.enrollmentModules.models
        .map(mod => mod.module)
        .sort((a, b) => moduleSorter.sort(a, b)),
    }),
  };
}

export default createEnrollmentRoutes;
