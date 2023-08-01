import Webservice from './base';

export default class AuthWebservice extends Webservice {
  async getUsers() {
    try {
      const url = this.parseURL({ path: 'users' });
      const response = await fetch(url);

      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async signUpUser(data) {
    try {
      const url = this.parseURL({ path: 'signup' });
      const response = await fetch(url, {
        method: 'POST',
        headers: this.requestHeaders,
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async loginUser(data) {
    try {
      const url = this.parseURL({ path: 'login' });
      const response = await fetch(url, {
        method: 'POST',
        headers: this.requestHeaders,
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async logoutUser(token) {
    try {
      const url = this.parseURL({ path: 'logout' });

      await fetch(url, {
        method: 'DELETE',
        headers: {
          ...this.requestHeaders,
          Authorization: token,
        },
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async requestResetPassword(data) {
    try {
      const url = this.parseURL({
        path: 'password',
        params: data,
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: this.requestHeaders,
      });

      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async resetPassword(data, token) {
    try {
      const url = this.parseURL({ path: 'password' });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...this.requestHeaders,
          Authorization: token,
        },
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async activateAccount(params) {
    try {
      const url = this.parseURL({
        path: 'signup/verification',
        params,
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: this.requestHeaders,
      });

      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async createVerification(data) {
    try {
      const url = this.parseURL({
        path: 'signup/verification',
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: this.requestHeaders,
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
