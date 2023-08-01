import Webservice from './base';

export default class ContentsWebservice extends Webservice {
  async getContents(params, token) {
    try {
      const url = this.parseURL({
        path: 'contents',
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

  async createContent(params, token) {
    try {
      const url = this.parseURL({ path: 'contents' });
  
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

  // async updateModule(id, data, token) {
  //   try {
  //     const url = this.parseURL({ path: `modules/${id}` });
  
  //     const response = await fetch(url, {
  //       method: 'PUT',
  //       headers: {
  //         ...this.requestHeaders,
  //         Authorization: token,
  //       },
  //       body: JSON.stringify(data),
  //     });
  
  //     return await response.json();
  //   } catch(e) {
  //     console.error(e);
  //     throw e;
  //   }
  // }

  // async deleteModule(id, token) {
  //   try {
  //     const url = this.parseURL({ path: `modules/${id}` });
  
  //     const response = await fetch(url, {
  //       method: 'DELETE',
  //       headers: {
  //         ...this.requestHeaders,
  //         Authorization: token,
  //       },
  //     });
  
  //     return await response.json();
  //   } catch(e) {
  //     console.error(e);
  //     throw e;
  //   }
  // }

  // async getModule({ id, params }, token) {
  //   try {
  //     const url = this.parseURL({ path: `modules/${id}`, params });
  
  //     const response = await fetch(url, {
  //       method: 'GET',
  //       headers: {
  //         ...this.requestHeaders,
  //         Authorization: token,
  //       },
  //     });
  
  //     return await response.json();
  //   } catch(e) {
  //     console.error(e);
  //     throw e;
  //   }
  // }
}
