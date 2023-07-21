import Webservice from './base';

export default class ModulesWebservice extends Webservice {
  async getModules(params, token) {
    const url = this.parseURL({
      path: 'modules',
      params,
    });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...this.requestHeaders,
        Authorization: token,
      },
    });

    return await response.json();
  }
}