import isEmpty from 'lodash-es/isEmpty';
import pick from 'lodash-es/pick';
import get from 'lodash-es/get';

function evaluateParams (
  schema, 
  {
    collection,
    params
  }
) {
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
  if(!isEmpty(collectionJoin.joinParams)) {
    return {
      count,
      results: collectionJoin.join(data.models)
    };
  }

  return {
    count,
    results: data.models
  };
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
    courses: {
      filter: data => !isEmpty(data.courseIds),
    },
  };

  constructor(params = {}) {
    this.filterParams = pick(params, Object.keys(this.#FILTER_OPTS));
  }

  filter(data) {
    let conditions = [];

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
    this.joinParams = params.join
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
   * @param {Object[]} models - MirageJs <Model>
   * @return {Object[]} Normalized object array
   */
  join(models) {
    return models.map(model => {
      let foreignAttrs = {};

      this.joinParams.forEach(param => {
        const foreignCollection = model[param];
        
        // We check if it is an array of models or just a single model
        if (!isEmpty(foreignCollection?.models)) {
          foreignAttrs[param] = foreignCollection.models;
        } else {
          foreignAttrs[param] = foreignCollection;
        }
      });

      return {
        ...model.attrs,
        ...foreignAttrs,
      };
    });
  }
}

export { evaluateParams };
