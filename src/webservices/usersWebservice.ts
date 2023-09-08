import type { FetchUsersParams, UserUpdateParams } from '@/types/user';
import Webservice from './base';

export default class UsersWebservice extends Webservice {
  async getUsers(params: FetchUsersParams) {
    try {
      const url = this.parseURL({
        path: 'users',
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

  async getUser(id: string) {
    try {
      const url = this.parseURL({ path: `users/${id}` });

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

  async updateUser({ id, data }: { id: string, data: UserUpdateParams }) {
    try {
      const url = this.parseURL({ path: `users/${id}` });

      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.requestHeaders(),
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async deleteUser(id: string) {
    try {
      const url = this.parseURL({ path: `users/${id}` });

      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.requestHeaders(),
      });

      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
