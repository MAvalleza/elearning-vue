import type { MappedCourse } from './course';
import type { MappedModule } from './module';

interface SortBy {
  order: string;
  key: string;
}

interface TableOptions {
  itemsPerPage: number | string;
  page: number | string;
  sortBy?: SortBy[];
}

interface TableActionOpt {
  action: string;
  item: GenericTableItem['item'];
}

interface GenericTableItem {
  item: {
    raw: MappedCourse &
      MappedModule & {
        id: string;
        isPublished: boolean;
      };
  };
}

export { SortBy, TableActionOpt, TableOptions, GenericTableItem };
