import pick from 'lodash-es/pick';

const TABLE_OPTIONS = ['itemsPerPage', 'sortBy', 'page'];

const mapOptionsToParams = opts => {
  const validOptions = pick(opts, TABLE_OPTIONS);

  const params = {
    limit: validOptions.itemsPerPage,
    page: validOptions.page,
  };

  if (validOptions?.sortBy[0]) {
    params.sortDirection = validOptions.sortBy[0].order;
    params.sort = validOptions.sortBy[0].key;
  }

  return params;
};

export { mapOptionsToParams };
