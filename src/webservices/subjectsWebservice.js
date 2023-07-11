import Webservice from './base';
export default class SubjectsWebservice extends Webservice {
  async getSubjects(token, params) {
    const url = this.parseURL({
      path: 'subjects',
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
