import queryString from 'query-string';

export default class Webservice {
  constructor() {
    this.apiNamespace = import.meta.env.VITE_API_NAMESPACE;
    this.requestHeaders = {
      'Content-Type': 'application/json',
    };
  }

  parseParams(params = {}) {
    const stringified = queryString.stringify(params, {
      arrayFormat: 'bracket',
      parseBooleans: true,
      skipNull: true,
      skipEmptyString: true,
    });

    return stringified ? `?${stringified}` : '';
  }

  parseURL({ path, params }) {
    const url = `${this.apiNamespace}/${path}${this.parseParams(params)}`;

    return url;
  }
}
