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
          currentUser.accessToken,
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        const mappedModules = response.results.map(mod => ({
          ...mod,
          status: mod.isPublished ? 'Published' : 'Draft',
          courseTitle: mod.course.title
        }));

        this.modules = mappedModules;
        this.modulesTotal = response.count;

        return mappedModules;
      } catch (e) {
        console.error(e);

        uiStore().showSnackbar({
          color: 'error',
          message: e.message,
        });
      } finally {
        uiStore().setLoading(false);
      }
    },
  }
})