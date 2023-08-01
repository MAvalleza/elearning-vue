import { defineStore } from 'pinia';
import ModulesWebservice from '@/webservices/modulesWebservice';
import { useContents as contentsStore } from './contents';
import { useUI as uiStore } from './ui';
import { useAuth as authStore } from './auth';
import isEmpty from 'lodash-es/isEmpty';
import omit from 'lodash-es/omit';

const webservice = new ModulesWebservice();

export const useModules = defineStore('modules', {
  state: () => ({
    modules: [],
    modulesTotal: 0,
    currentModule: {},
    currentModuleContent: {}, // content of current module
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

        // Create the module
        const response = await webservice.createModule(
          omit(data, 'content'),
          currentUser.accessToken
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        // Create the module content
        const moduleId = response.id;

        await contentsStore().createContent({
          moduleId,
          content: data.content,
          type: 'document', // Assigned 'document' when created thru rich text editor
        });

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
    async fetchModule(id, params) {
      try {
        uiStore().setLoading(true);

        const currentUser = authStore().currentUser;

        // Fetch module
        const response = await webservice.getModule(
          {
            id,
            params,
          },
          currentUser.accessToken
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        // Fetch content
        const contentResponse = await contentsStore().fetchContents({
          module: id,
        });

        this.currentModule = { ...response };

        // We get first element since we used fetch endpoint which returns array
        this.currentModuleContent = { ...contentResponse?.[0] };
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: 'There was an error in fetching the module.',
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
