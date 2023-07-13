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

// Determines the table action for a published/draft resource
const getTableStatusAction = (isPublished) => {
  const STATUS_ACTION = {
    published: {
      icon: {
        icon: 'mdi-pencil'
      },
      title: 'Draft',
      action: 'draft'
    },
    draft: {
      icon: {
        icon: 'mdi-check',
        color: 'success',
      },
      title: 'Publish',
      action: 'publish',
    },
  };

  if (isPublished) {
    return STATUS_ACTION.published;
  } else {
    return STATUS_ACTION.draft;
  }
}

export { mapOptionsToParams, getTableStatusAction };
