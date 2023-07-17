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

  async createSubject(params, token) {
    const url = this.parseURL({ path: 'subjects' });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...this.requestHeaders,
        Authorization: token,
      },
      body: JSON.stringify(params)
    });

    return await response.json();
  }

  async getSubject({ id, params }, token) {
    const url = this.parseURL({ path: `subjects/${id}`, params });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...this.requestHeaders,
        Authorization: token,
      },
    });

    return await response.json();
  }

  async updateSubject(id, data, token) {
    const url = this.parseURL({ path: `subjects/${id}` });

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

  async deleteSubject(id, token) {
    const url = this.parseURL({ path: `subjects/${id}` });

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
