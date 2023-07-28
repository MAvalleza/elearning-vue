import { type Course } from './course';
import { type Module } from './module';

interface SortBy {
  order: string,
  key: string,
}

interface TableOptions {
  itemsPerPage: number | string,
  page: number | string,
  sortBy?: SortBy[],
}

interface TableActionOpt {
  action: string,
  item: GenericTableItem['item']
}

// TODO: Declare assertions for the entity types (subject, courses, module)
interface GenericTableItem {
  item: {
    raw: Course & Module & {
      id: string,
      isPublished: boolean,
    }
  }
}

export {
  SortBy,
  TableActionOpt,
  TableOptions,
  GenericTableItem
};