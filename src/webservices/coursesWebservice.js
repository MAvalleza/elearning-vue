import Webservice from './base';
export default class CoursesWebservice extends Webservice {
  async getCourses(params, token) {
    try {
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
    } catch(e) {
      console.error(e);
      throw e;
    }
  }

  async createCourse(params, token) {
    try {
      const url = this.parseURL({ path: 'courses' });
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...this.requestHeaders,
          Authorization: token,
        },
        body: JSON.stringify(params),
      });
  
      return await response.json();
    } catch(e) {
      console.error(e);
      throw e;
    }
  }

  async updateCourse(id, data, token) {
    try {
      const url = this.parseURL({ path: `courses/${id}` });
  
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          ...this.requestHeaders,
          Authorization: token,
        },
        body: JSON.stringify(data),
      });
  
      return await response.json();
    } catch(e) {
      console.error(e);
      throw e;
    }
  }

  async deleteCourse(id, token) {
    try {
      const url = this.parseURL({ path: `courses/${id}` });
  
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          ...this.requestHeaders,
          Authorization: token,
        },
      });
  
      return await response.json();
    } catch(e) {
      console.error(e);
      throw e;
    }
  }

  async getCourse({ id, params }, token) {
    try {
      const url = this.parseURL({ path: `courses/${id}`, params });
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...this.requestHeaders,
          Authorization: token,
        },
      });
  
      return await response.json();
    } catch(e) {
      console.error(e);
      throw e;
    }
  }
}
