import queryString from 'query-string';

export default class Webservice {
  apiNamespace: string;

  constructor() {
    this.apiNamespace = import.meta.env.VITE_API_NAMESPACE;
  }

  requestHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
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

  parseURL({ path, params }: { path: string; params?: object }) {
    const url = `${this.apiNamespace}/${path}${this.parseParams(params)}`;

    return url;
  }
}

function getToken() {
  const storedToken = localStorage.getItem('accessToken');

  if (storedToken !== null) {
    return storedToken;
  }
}
