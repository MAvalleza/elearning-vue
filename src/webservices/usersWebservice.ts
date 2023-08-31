import type { FetchUsersParams } from '@/types/user';
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
        headers: this.requestHeaders()
      });

      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
