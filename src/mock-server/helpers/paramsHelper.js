import isEmpty from 'lodash-es/isEmpty';
import pick from 'lodash-es/pick';

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
  constructor(params) {
    this.sortKey = params.sort;
    this.order = params.sortDirection
  }

  sort(a, b) {
    if (this.order === 'ASC') {
      return b[this.sortKey] > a[this.sortKey];
    } else {
      return a[this.sortKey] > b[this.sortKey]; 
    }
  }
}

export {
  PaginationParams,
  Filter,
  Sorter,
};