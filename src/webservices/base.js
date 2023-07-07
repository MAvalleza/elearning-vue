import queryString from "query-string";

export default class Webservice {
  constructor () {
    this.apiNamespace = import.meta.env.VITE_API_NAMESPACE;
    this.requestHeaders = {
      'Content-Type': 'application/json',
    };
  }

  parseParams(params = {}) {
    return queryString.stringify(
      params,
      {
        skipNull: true,
        skipEmptyString: true,
      },
    );
  }

  parseURL({ path, params }) {
    const url = `${this.apiNamespace}/${path}?${this.parseParams(params)}`;

    return url;
  }
}