interface FetchParams {
  page?: number;
  limit?: number;
  sort?: string;
  sortDirection?: string;
  keyword?: string;
  published?: boolean;
  join?: string[];
}

export { FetchParams };