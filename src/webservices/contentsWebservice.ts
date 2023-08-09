import Webservice from './base';
import { type FetchContentsParams, type Content } from '@/types/content';

export default class ContentsWebservice extends Webservice {
  async getContents(params: FetchContentsParams, token: string) {
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
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async createContent(params: Content, token: string) {
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
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async updateContent(id: string, data: { content: Content['content'] }, token: string) {
    try {
      const url = this.parseURL({ path: `contents/${id}` });

      const response = await fetch(url, {
        method: 'PUT',
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
}
