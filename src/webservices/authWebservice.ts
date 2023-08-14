import type { LoginCredentials, PasswordRequest } from '@/types/auth';
import Webservice from './base';

interface UserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export default class AuthWebservice extends Webservice {
  async getUsers(params: object) {
    try {
      const url = this.parseURL({
        path: 'users',
        params,
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: this.requestHeaders()
      });

      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async signUpUser(data: UserData) {
    try {
      const url = this.parseURL({ path: 'signup' });
      const response = await fetch(url, {
        method: 'POST',
        headers: this.requestHeaders(),
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async loginUser(data: LoginCredentials) {
    try {
      const url = this.parseURL({ path: 'login' });
      const response = await fetch(url, {
        method: 'POST',
        headers: this.requestHeaders(),
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async logoutUser() {
    try {
      const url = this.parseURL({ path: 'logout' });

      await fetch(url, {
        method: 'DELETE',
        headers: this.requestHeaders(),
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async requestResetPassword(data: PasswordRequest) {
    try {
      const url = this.parseURL({
        path: 'password',
        params: data,
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: this.requestHeaders(),
      });

      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async resetPassword(data: { password: string }, resetToken: string) {
    try {
      const url = this.parseURL({ path: 'password' });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...this.requestHeaders(),
          Authorization: `Bearer ${resetToken}`,
        },
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async activateAccount(params: { token: string }) {
    try {
      const url = this.parseURL({
        path: 'signup/verification',
        params,
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: this.requestHeaders(),
      });

      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async createVerification(data: { email: string }) {
    try {
      const url = this.parseURL({
        path: 'signup/verification',
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: this.requestHeaders(),
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
