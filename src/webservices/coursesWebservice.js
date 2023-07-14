import Webservice from './base';
export default class CoursesWebservice extends Webservice {
  async getCourses(params, token) {
    const url = this.parseURL({
      path: 'courses',
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