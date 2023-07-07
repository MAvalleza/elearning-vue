class PaginationParams {
  constructor(params) {
    const { limit = 10 , page = 1} = params;

    this.start = (page - 1) * limit;
    this.end = this.start + limit;
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
  Sorter,
};