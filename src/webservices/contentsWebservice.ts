import Webservice from './base';
import type {
  FetchContentsParams,
  Content,
  ContentUpdateParams,
} from '@/types/content';

export default class ContentsWebservice extends Webservice {
  async getContents(params: FetchContentsParams) {
    try {
      const url = this.parseURL({
        path: 'contents',
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

  async createContent(params: Content) {
    try {
      const url = this.parseURL({ path: 'contents' });

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

  async updateContent(id: string, data: ContentUpdateParams) {
    try {
      const url = this.parseURL({ path: `contents/${id}` });

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
