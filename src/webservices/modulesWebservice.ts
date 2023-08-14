import Webservice from './base';
import type { FetchParams, GetParams } from '@/types/params';
import type { ModuleUpdateParams, ModuleCreateParams } from '@/types/module';

export default class ModulesWebservice extends Webservice {
  async getModules(params: FetchParams) {
    try {
      const url = this.parseURL({
        path: 'modules',
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
  async createModule(params: ModuleCreateParams) {
    try {
      const url = this.parseURL({ path: 'modules' });

      const response = await fetch(url, {
        method: 'POST',
        headers: this.requestHeaders(),
        body: JSON.stringify(params),
      });

      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async updateModule(id: string, data: ModuleUpdateParams) {
    try {
      const url = this.parseURL({ path: `modules/${id}` });

      const response = await fetch(url, {
        method: 'PUT',
        headers: this.requestHeaders(),
        body: JSON.stringify(data),
      });

      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async deleteModule(id: string) {
    try {
      const url = this.parseURL({ path: `modules/${id}` });

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

  async getModule({ id, params }: { id: string, params?: GetParams }) {
    try {
      const url = this.parseURL({ path: `modules/${id}`, params });

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
}
