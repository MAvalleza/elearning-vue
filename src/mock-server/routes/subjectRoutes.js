import { Response } from 'miragejs';
import { PaginationParams, Sorter } from '../helpers/paramsHelper';
import isEmpty from 'lodash-es/isEmpty';

const createSubjectRoutes = routeInstance => {
  // TODO: Param checkers
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

    const {
      // join, // TODO: Handle join
      keyword,
      published,
      courses
    } = request.queryParams;

    // TODO: Possibly reuse or optimize this for other endpoints
    // Filter
    const subjectFilter = (data) => {
      // Put all conditions in an array then evaluate at the end
      let conditions = [];

      if (keyword) {
        conditions.push(
          data.title.includes(keyword)
        );
      }

      if (published) {
        conditions.push(data.isPublished);
      }

      if (courses) {
        conditions.push(
          !isEmpty(data.courseIds)
        )
      }

      return conditions.reduce(
        (acc, curr) => acc && curr,
        true
      );
    };

    // Appy filters
    let collection = schema.subjects
      .where({ ownerId: user.id })
      .filter(subjectFilter);
    
    console.log('coll', collection);

    // Sorting Params
    const sorter = new Sorter(request.queryParams);

    // Check if sort parameter exists then apply sorting
    if (sorter.sortKey) {
      console.log('here');
      collection = collection.sort(sorter.sort);
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
