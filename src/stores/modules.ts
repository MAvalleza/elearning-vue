import { defineStore } from 'pinia';
import isEmpty from 'lodash-es/isEmpty';
import omit from 'lodash-es/omit';
import ModulesWebservice from '@/webservices/modulesWebservice';
import { useContents as contentsStore } from './contents';
import { useUI as uiStore } from './ui';
import { getUpdatedAttributes } from '@/helpers/paramsHelper';
import type { FetchParams, GetParams } from '@/types/params';
import type {
  MappedModule,
  Module,
  ModuleCreateParams,
  ModuleUpdateParams
} from '@/types/module';

const webservice = new ModulesWebservice();

export const useModules = defineStore('modules', {
  state: () => ({
    modules: <MappedModule[]>[],
    modulesTotal: 0,
    modulesCurrentPage: 1,
    loadingModules: false,
    currentModule: <Module>{},
    currentModuleContent: {}, // content of current module
  }),
  actions: {
    async fetchModules(params: FetchParams) {
      try {
        this.loadingModules = true;

        const response = await webservice.getModules(params);

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        const mappedModules = mapModules(response.data)
        this.modules = mappedModules;
        this.modulesTotal = response.totalCount;
        this.modulesCurrentPage = response.page;

        return mappedModules;
      } catch (e) {
        if (e instanceof Error) {
          uiStore().showSnackbar({
            color: 'error',
            message: e.message,
          });
        } else {
          uiStore().showSnackbar({
            color: 'error',
            message: 'There was an error.'
          });
        }

        return [];
      } finally {
        this.loadingModules = false;
      }
    },
    async createModule(data: ModuleCreateParams) {
      try {
        this.loadingModules = true;

        // Create the module
        const response = await webservice.createModule(
          omit(data, 'content'),
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        // Create the module content
        const moduleId = response.id;

        await contentsStore().createContent({
          moduleId,
          content: data.content,
          isPublished: data.isPublished,
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
        this.loadingModules = false;
      }
    },
    async updateModule(id: string, params: ModuleUpdateParams) {
      try {
        this.loadingModules = true;

        const response = await webservice.updateModule(
          id,
          getUpdatedAttributes(this.currentModule, params),
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
        this.loadingModules = false;
      }
    },
    async deleteModule(id: string) {
      try {
        this.loadingModules = true;

        const response = await webservice.deleteModule(id);

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
        this.loadingModules = false;
      }
    },
    async fetchModule(id: string, params?: GetParams) {
      try {
        this.loadingModules = true;

        // Fetch module
        const response = await webservice.getModule(
          {
            id,
            params,
          },
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
        if (contentResponse[0]) {
          this.currentModuleContent = { ...contentResponse[0] };
        }
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: 'There was an error in fetching the module.',
        });
      } finally {
        this.loadingModules = false;
      }
    },
    async onTableAction({ id, action }: { id: string, action: string }) {
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

      return null;
    },
  },
});

function mapModules(modules: Module[]) {
 return modules.map(mod => ({
    ...mod,
    status: mod.isPublished ? 'Published' : 'Draft',
    courseTitle: mod.course.title,
  }));
}