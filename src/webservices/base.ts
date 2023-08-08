import queryString from 'query-string';

interface RequestHeader {
  'Content-Type': string;
}

export default class Webservice {
  apiNamespace: string;
  requestHeaders: RequestHeader

  constructor() {
    this.apiNamespace = import.meta.env.VITE_API_NAMESPACE;
    this.requestHeaders = {
      'Content-Type': 'application/json',
    };
  }

  parseParams(params = {}) {
    const stringified = queryString.stringify(params, {
      arrayFormat: 'bracket',
      skipNull: true,
      skipEmptyString: true,
    });

    return stringified ? `?${stringified}` : '';
  }

  parseURL({ path, params }: { path: string, params: object }) {
    const url = `${this.apiNamespace}/${path}${this.parseParams(params)}`;

    return url;
  }
}
