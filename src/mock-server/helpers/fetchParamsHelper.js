import { isArray, isEmpty, pick, get } from 'lodash-es';

class Response {
  constructor({ data, count, params }) {
    this.data = data;
    this.totalCount = count;
    this.page = params.page || 1;
    this.limit = params.limit || 25;
  }
}

function evaluateParams(schema, { collection, params }) {
  let data = collection;

  const filter = new Filter(params);
  const sorter = new Sorter(params);
  const pagination = new PaginationParams(params);
  const collectionJoin = new CollectionJoin(schema, params);

  // Apply filters
  if (!isEmpty(filter.filterParams)) {
    data = data.filter(data => {
      return filter.filter(data);
    });
  }

  // Apply sorting
  if (sorter.sortKey) {
    data = data.sort((a, b) => {
      return sorter.sort(a, b);
    });
  }

  // Save count before applying pagination
  const count = data.length;

  // Apply pagination
  data = pagination.paginate(data);

  // Join foreign collections
  if (!isEmpty(collectionJoin.joinParams)) {
    return new Response({
      data: collectionJoin.join(data.models),
      count,
      params,
    });
  }

  return new Response({
    data: data.models,
    count,
    params,
  });
}

class PaginationParams {
  constructor(params) {
    const { limit = 25, page = 1 } = params;

    this.start = (page - 1) * limit;
    this.end = this.start + limit;
  }

  paginate(data) {
    return data.slice(this.start, this.end);
  }
}

class Filter {
  #FILTER_OPTS = {
    keyword: {
      filter: (data, params) => {
        const title = data.title.toLowerCase();
        const keyword = params.keyword.toLowerCase();

        return title.includes(keyword);
      },
    },
    published: {
      filter: (data, params) => {
        // We parse the parse to handle boolean values that are strings
        return data.isPublished === JSON.parse(params.published);
      },
    },
    // Filter those with modules only
    sections: {
      filter: data => !isEmpty(data.moduleIds),
    },
    // Filter those with courses only
    courses: {
      filter: data => !isEmpty(data.courseIds),
    },
    // Filter according to status of enrollment modules
    completed: {
      filter: (data, params) => {
        const enrollmentModules = data.enrollmentModules.models;

        return !isEmpty(enrollmentModules.filter(mod => mod.isCompleted === JSON.parse(params.completed)));
      }
    }
  };

  constructor(params = {}) {
    this.filterParams = pick(params, Object.keys(this.#FILTER_OPTS));
  }

  filter(data) {
    const conditions = [];

    // Evaluate the parameters based on the filter methods for those parameters
    // Push the result to an array.
    Object.keys(this.filterParams).forEach(key => {
      conditions.push(this.#FILTER_OPTS[key].filter(data, this.filterParams));
    });

    // Return the reduced result
    return conditions.reduce((acc, curr) => acc && curr, true);
  }
}

class Sorter {
  #SORT_METHODS = {
    asc: 1,
    desc: -1,
  };

  #CUSTOM_SORT_KEYS = {
    totalCourses: 'courseIds.length',
    status: 'isPublished',
  };

  constructor(params) {
    this.sortKey = this.#CUSTOM_SORT_KEYS[params.sort] || params.sort;
    this.order = params.sortDirection;
  }

  sort(a, b) {
    const sortMethod = this.#SORT_METHODS[this.order];

    if (get(a, this.sortKey) > get(b, this.sortKey)) {
      return 1 * sortMethod;
    } else if (get(a, this.sortKey) < get(b, this.sortKey)) {
      return -1 * sortMethod;
    } else {
      return 0;
    }
  }
}

class CollectionJoin {
  constructor(schema, params) {
    this.schema = schema;
    this.joinParams = params.join;
  }

  /**
   * Mirage Models are schemaless in their attributes, but their relationship schema is known.
   * (e.g. `subject.courses` will return the foreign Courses Collection)
   *
   * However, since Mirage normalizes the models upon response,
   * the relationship feature is not included along with the model's attributes
   *
   * To work around that, we do the normalization ourselves to include the
   * relationship values.
   *
   * We store all foreign values in a new object, and return both the attributes of
   * the model and that object.
   *
   * @param {Object[] | Object} data - MirageJs <Model>
   * @return {Object[]} Normalized object array
   */
  join(data) {
    if (!isArray(data)) {
      return this.#evaluateJoin(data);
    }
    return data.map(model => {
      return this.#evaluateJoin(model);
    });
  }

  #evaluateJoin(model) {
    const foreignAttrs = {};

    if (!this.joinParams) {
      return model.attrs;
    }

    this.joinParams.forEach(param => {
      const foreignCollection = model[param];

      // We check if it is an array of models or just a single model
      if (!isEmpty(foreignCollection?.models)) {
        foreignAttrs[param] = foreignCollection.models;
      } else if (isArray(foreignCollection?.models)) {
        foreignAttrs[param] = foreignCollection.models;
      } else {
        foreignAttrs[param] = foreignCollection;
      }
    });

    return {
      ...model.attrs,
      ...foreignAttrs,
    };
  }
}

// Params for usage in MirageJS Collection `where` method
class RelationshipFilter {
  #RELATIONSHIP_KEYS = ['ownerId', 'authorId', 'courseId', 'subjectId'];

  constructor(params) {
    this.params = pick(params, this.#RELATIONSHIP_KEYS);
  }
}

export { evaluateParams, CollectionJoin, RelationshipFilter, Sorter };
