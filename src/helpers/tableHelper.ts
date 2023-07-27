import { TableOptions } from '@/types/data-table';

const mapOptionsToParams = (opts: TableOptions): object => {
  const params: {
    limit: number | string;
    page: number | string;
    sortDirection?: string;
    sort?: string;
  } = {
    limit: opts.itemsPerPage,
    page: opts.page,
  };

  if (opts?.sortBy[0]) {
    params.sortDirection = opts.sortBy[0].order;
    params.sort = opts.sortBy[0].key;
  }

  return params;
};

// Determines the table action for a published/draft resource
const getTableStatusAction = (isPublished: boolean): object => {
  const STATUS_ACTION = {
    published: {
      icon: {
        icon: 'mdi-pencil',
      },
      title: 'Draft',
      action: 'draft',
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
};

export { mapOptionsToParams, getTableStatusAction, TableOptions };
