import { defineStore } from 'pinia';
import ContentsWebservice from '@/webservices/contentsWebservice';
import { useUI as uiStore } from './ui';
import { useAuth as authStore } from './auth';
import isEmpty from 'lodash-es/isEmpty';
import type { Content, ContentUpdateParams, FetchContentsParams } from '@/types/content';

const webservice = new ContentsWebservice();

export const useContents = defineStore('contents', {
  state: () => ({
    contents: <Content[]>[],
    contentsTotal: 0,
    currentContent: {},
  }),
  actions: {
    async fetchContents(params: FetchContentsParams) {
      try {
        uiStore().setLoading(true);

        const currentUser = authStore().currentUser;

        const response = await webservice.getContents(
          params,
          currentUser.accessToken
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        this.contents = response.data;
        this.contentsTotal = response.totalCount;

        return this.contents;
      } catch (e) {
        if (e instanceof Error) {
          uiStore().showSnackbar({
            color: 'error',
            message: e.message,
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

        const currentUser = authStore().currentUser;

        const response = await webservice.createContent(
          data,
          currentUser.accessToken
        );

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

        const currentUser = authStore().currentUser;

        const response = await webservice.updateContent(
          id,
          params,
          currentUser.accessToken
        );

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
