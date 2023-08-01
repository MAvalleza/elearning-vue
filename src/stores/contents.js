import { defineStore } from 'pinia';
import ContentsWebservice from '@/webservices/contentsWebservice';
import { useUI as uiStore } from './ui';
import { useAuth as authStore } from './auth';
import isEmpty from 'lodash-es/isEmpty';

const webservice = new ContentsWebservice();

export const useContents = defineStore('contents', {
  state: () => ({
    contents: [],
    contentsTotal: 0,
    currentContent: {},
  }),
  actions: {
    async fetchContents(params) {
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

        this.contents = response.results;
        this.contentsTotal = response.count;

        return this.contents;
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: e.message,
        });
      } finally {
        uiStore().setLoading(false);
      }
    },
    async createContent(data) {
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
    async updateContent(id, params) {
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
    // async deleteModule(id) {
    //   try {
    //     uiStore().setLoading(true);

    //     const currentUser = authStore().currentUser;

    //     const response = await webservice.deleteModule(
    //       id,
    //       currentUser.accessToken
    //     );

    //     if (!isEmpty(response.errors)) {
    //       throw Error(response.errors[0]);
    //     }

    //     uiStore().showSnackbar({
    //       color: 'success',
    //       message: 'Successfully deleted the module.',
    //     });
    //   } catch (e) {
    //     uiStore().showSnackbar({
    //       color: 'error',
    //       message: 'There was an error in deleting the module.',
    //     });
    //   } finally {
    //     uiStore().setLoading(false);
    //   }
    // },
    // async fetchModule(id, params) {
    //   try {
    //     uiStore().setLoading(true);

    //     const currentUser = authStore().currentUser;

    //     const response = await webservice.getModule(
    //       {
    //         id,
    //         params,
    //       },
    //       currentUser.accessToken
    //     );

    //     if (!isEmpty(response.errors)) {
    //       throw Error(response.errors[0]);
    //     }

    //     this.currentModule = response;
    //   } catch (e) {
    //     uiStore().showSnackbar({
    //       color: 'error',
    //       message: 'There was an error in fetching the module.',
    //     });
    //   } finally {
    //     uiStore().setLoading(false);
    //   }
    // },
  },
});
