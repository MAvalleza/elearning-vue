// Using the term `Fetch` to refer to list fetching

interface FetchParams {
  page?: number;
  limit?: number;
  sort?: string;
  sortDirection?: string;
  keyword?: string;
  published?: boolean;
  join?: string[];
}

// Using the term `Get` for specific item fetch
interface GetParams {
  join?: string[];
}

export { FetchParams, GetParams };
