import type { GenericTableItem, TableOptions } from '@/types/data-table';
import isNil from 'lodash-es/isNil';

// Convert vuetify options to the specified params for the API query
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

  if (opts.sortBy?.[0]) {
    params.sortDirection = opts.sortBy[0].order;
    params.sort = opts.sortBy[0].key;
  }

  return params;
};

// Supplies the available actions for each table item
const getTableActions = (item: GenericTableItem['item']) => {
  const DELETE_ACTION = {
    icon: {
      icon: 'mdi-delete',
      color: 'error',
    },
    title: 'Delete',
    action: 'delete',
  };

  const statusAction = getTableStatusAction(item.raw);

  return [
    statusAction,
    DELETE_ACTION,
  ].filter(action => action);
}

// Determines the table action for a published/draft resource
const getTableStatusAction = ({ isPublished, isActive }: { isPublished?: boolean; isActive?: boolean; }) => {
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
    active: {
      icon: {
        icon: 'mdi-close',
      },
      title: 'Set inactive',
      action: 'inactive',
    },
    inactive: {
      icon: {
        icon: 'mdi-check',
        color: 'success',
      },
      title: 'Set active',
      action: 'active',
    }
  };
  
  if (!isNil(isPublished)) {
    return isPublished ? STATUS_ACTION.published : STATUS_ACTION.draft;
  } else if (!isNil(isActive)) {
    return isActive ? STATUS_ACTION.active : STATUS_ACTION.inactive;
  }

  return null;
};

export { mapOptionsToParams, getTableActions };
