import { defineStore } from 'pinia';
import ContentsWebservice from '@/webservices/contentsWebservice';
import { useUI as uiStore } from './ui';
import isEmpty from 'lodash-es/isEmpty';
import type {
  Content,
  ContentUpdateParams,
  FetchContentsParams,
} from '@/types/content';

const webservice = new ContentsWebservice();

export const useContents = defineStore('contents', {
  state: () => ({
    contents: <Content[]>[],
    contentsTotal: 0,
    contentsCurrentPage: 1,
    currentContent: {},
  }),
  actions: {
    async fetchContents(params: FetchContentsParams) {
      try {
        uiStore().setLoading(true);

        const response = await webservice.getContents(params);

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        this.contents = response.data;
        this.contentsTotal = response.totalCount;
        this.contentsCurrentPage = response.page;

        return this.contents;
      } catch (e) {
        if (e instanceof Error) {
          uiStore().showSnackbar({
            color: 'error',
            message: e.message,
          });
        } else {
          uiStore().showSnackbar({
            color: 'error',
            message: 'There was an error.',
          });
        }

        return [];
      } finally {
        uiStore().setLoading(false);
      }
    },
    async createContent(data: Content) {
      try {
        uiStore().setLoading(true);

        const response = await webservice.createContent(data);

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }
      } catch (e) {
        console.error(e);
        throw e;
      } finally {
        uiStore().setLoading(false);
      }
    },
    async updateContent(id: string, params: ContentUpdateParams) {
      try {
        uiStore().setLoading(true);

        const response = await webservice.updateContent(id, params);

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: 'There was an error in updating the content.',
        });
      } finally {
        uiStore().setLoading(false);
      }
    },
  },
});
