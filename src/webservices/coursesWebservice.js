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

  async updateCourse(id, data, token) {
    const url = this.parseURL({ path: `courses/${id}` });

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...this.requestHeaders,
        Authorization: token,
      },
      body: JSON.stringify(data)
    });

    return await response.json();
  }

  async deleteCourse(id, token) {
    const url = this.parseURL({ path: `courses/${id}` });

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...this.requestHeaders,
        Authorization: token,
      },
    });

    return await response.json();
  }
}