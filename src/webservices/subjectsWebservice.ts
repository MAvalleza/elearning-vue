import Webservice from './base';
import { GetParams, type FetchParams } from '@/types/params';
import { type SubjectCreateParams } from '@/types/subject';

export default class SubjectsWebservice extends Webservice {
  async getSubjects(params: FetchParams) {
    try {
      const url = this.parseURL({
        path: 'subjects',
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

  async createSubject(params: SubjectCreateParams) {
    try {
      const url = this.parseURL({ path: 'subjects' });

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

  async getSubject({ id, params }: { id: string, params: GetParams }) {
    try {
      const url = this.parseURL({ path: `subjects/${id}`, params });

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

  async updateSubject(id: string, data: Partial<SubjectCreateParams>) {
    try {
      const url = this.parseURL({ path: `subjects/${id}` });

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

  async deleteSubject(id: string) {
    try {
      const url = this.parseURL({ path: `subjects/${id}` });

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
