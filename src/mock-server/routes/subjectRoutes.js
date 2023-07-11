import { Response } from 'miragejs';
import { PaginationParams, Filter, Sorter } from '../helpers/paramsHelper';
import isEmpty from 'lodash-es/isEmpty';

const createSubjectRoutes = routeInstance => {
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
        { errors: ['User does not exist.'] }
      );
    }

    // TODO: Handle join

    let collection = schema.subjects.where({ ownerId: user.id });

    // Appy filters and sorting
    const subjectFilter = new Filter(request.queryParams);
    if (!isEmpty(subjectFilter.filterParams)) {
      collection = collection.filter(data => {
        return subjectFilter.filter(data);
      });
    }

    const subjectSorter = new Sorter(request.queryParams);
    if (subjectSorter.sortKey) {
      collection = collection.sort((a, b) => {
        return subjectSorter.sort(a, b);
      });
    }

    // Pagination Params
    const { start, end } = new PaginationParams(request.queryParams);

    collection = collection.slice(start, end);

    return new Response(
      200,
      { some: 'header' },
      {
        count: collection.length,
        results: collection.models,
      }
    );
  });
};

export default createSubjectRoutes;
