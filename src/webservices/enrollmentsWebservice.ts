import type {
  GetEnrollmentParams,
  EnrollmentCreateParams,
  FetchEnrollmentsParams,
  EnrollmentUpdateParams
} from '@/types/enrollment';
import Webservice from './base';

export default class EnrollmentsWebservice extends Webservice {
  async getEnrollments(params: FetchEnrollmentsParams) {
    try {
      const url = this.parseURL({
        path: 'enrollments',
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

  async createEnrollment(params: EnrollmentCreateParams) {
    try {
      const url = this.parseURL({ path: 'enrollments' });

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

  async deleteEnrollment(id: string) {
    try {
      const url = this.parseURL({ path: `enrollments/${id}` });

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

  async getEnrollment({ id, params }: { id: string, params: GetEnrollmentParams }) {
    try {
      const url = this.parseURL({
        path: `enrollments/${id}`,
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

  async updateEnrollment(id: string, data: EnrollmentUpdateParams) {
    try {
      const url = this.parseURL({ path: `enrollments/${id}` });

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
}
