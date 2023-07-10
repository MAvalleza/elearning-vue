import isEmpty from 'lodash-es/isEmpty';
import pick from 'lodash-es/pick';
import get from 'lodash-es/get';

class PaginationParams {
  constructor(params) {
    const { limit = 10 , page = 1} = params;

    this.start = (page - 1) * limit;
    this.end = this.start + limit;
  }
}

class Filter {
  #FILTER_OPTS = {
    keyword: {
      filter: (data, params) => {
        return data.title.includes(params.keyword)
      },
    },
    published: {
      filter: (data) => data.isPublished,
    },
    courses: {
      filter: (data) => !isEmpty(data.courseIds),
    },
  }

  constructor(params = {}) {
    this.filterParams = pick(
      params,
      Object.keys(this.#FILTER_OPTS),
    );
  }

  filter(data) {
    let conditions = [];

    // Evaluate the parameters based on the filter methods for those parameters
    // Push the result to an array.
    Object.keys(this.filterParams).forEach(key => {
      conditions.push(this.#FILTER_OPTS[key].filter(data, this.filterParams))
    });

    // Return the reduced result
    return conditions.reduce(
      (acc, curr) => acc && curr,
      true
    );
  }
}

class Sorter {
  #SORT_METHODS = {
    asc: 1,
    desc: -1
  }

  #CUSTOM_SORT_KEYS = {
    coursesLength: 'courseIds.length',
  }

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

export {
  PaginationParams,
  Filter,
  Sorter,
};