import { defineStore } from 'pinia';
import ModulesWebservice from '@/webservices/modulesWebservice';
import { useUI as uiStore } from './ui';
import { useAuth as authStore } from './auth';
import isEmpty from 'lodash-es/isEmpty';

const webservice = new ModulesWebservice();

export const useModules = defineStore('modules', {
  state: () => ({
    modules: [],
    modulesTotal: 0,
    currentModule: {},
  }),
  actions: {
    async fetchModules(params) {
      try {
        uiStore().setLoading(true);

        const currentUser = authStore().currentUser;

        const response = await webservice.getModules(
          params,
          currentUser.accessToken
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        const mappedModules = response.results.map(mod => ({
          ...mod,
          status: mod.isPublished ? 'Published' : 'Draft',
          courseTitle: mod.course.title,
        }));

        this.modules = mappedModules;
        this.modulesTotal = response.count;

        return mappedModules;
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: e.message,
        });
      } finally {
        uiStore().setLoading(false);
      }
    },
    async createModule(data) {
      try {
        uiStore().setLoading(true);

        const currentUser = authStore().currentUser;

        const response = await webservice.createModule(
          data,
          currentUser.accessToken
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        uiStore().showSnackbar({
          color: 'success',
          message: 'Successfully created the module.',
        });
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: 'There was an error in creating the module.',
        });
      } finally {
        uiStore().setLoading(false);
      }
    },
    async updateModule(id, params) {
      try {
        uiStore().setLoading(true);

        const currentUser = authStore().currentUser;

        const response = await webservice.updateModule(
          id,
          params,
          currentUser.accessToken
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        uiStore().showSnackbar({
          color: 'success',
          message: 'Successfully updated the module.',
        });
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: 'There was an error in updating the module.',
        });

        this.$router.push({ name: 'modules-list' });
      } finally {
        uiStore().setLoading(false);
      }
    },
    async deleteModule(id) {
      try {
        uiStore().setLoading(true);

        const currentUser = authStore().currentUser;

        const response = await webservice.deleteModule(
          id,
          currentUser.accessToken
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        uiStore().showSnackbar({
          color: 'success',
          message: 'Successfully deleted the module.',
        });
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: 'There was an error in deleting the module.',
        });
      } finally {
        uiStore().setLoading(false);
      }
    },
    async onTableAction({ id, action }) {
      switch (action) {
        case 'delete':
          return { id, delete: true };
        case 'publish':
          await this.updateModule(id, { isPublished: true });
          break;
        case 'draft':
          await this.updateModule(id, { isPublished: false });
          break;
        default:
          break;
      }
    },
  },
});
