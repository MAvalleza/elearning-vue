import { defineStore } from 'pinia';
import isEmpty from 'lodash-es/isEmpty';
import UsersWebservice from '@/webservices/usersWebservice';
import { useUI as uiStore } from '@/stores/ui';
import { getUpdatedAttributes } from '@/helpers/paramsHelper';
import type {
  MappedUser,
  FetchUsersParams,
  UserUpdateParams,
} from '@/types/user';

const webservice = new UsersWebservice();

export const useUsers = defineStore('users', {
  state: () => ({
    users: <MappedUser[]>[],
    currentFetchedUser: <MappedUser>{},
    usersTotal: 0,
    usersCurrentPage: 1,
    loadingUsers: false,
  }),
  actions: {
    async fetchUsers(params: FetchUsersParams) {
      try {
        this.loadingUsers = true;

        const response = await webservice.getUsers(params);

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        this.users = response.data;
        this.usersTotal = response.totalCount;
        this.usersCurrentPage = response.page;

        return this.users;
      } catch (e) {
        if (e instanceof Error) {
          uiStore().showSnackbar({
            color: 'error',
            message: e.message,
          });
        } else {
          uiStore().showSnackbar({
            color: 'error',
            message: 'There was an error in fetching users',
          });
        }

        return [];
      } finally {
        this.loadingUsers = false;
      }
    },

    async fetchUser(id: string) {
      try {
        this.loadingUsers = true;

        const response = await webservice.getUser(id);

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        this.currentFetchedUser = response;
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: 'There was an error in fetching the user.',
        });
      } finally {
        this.loadingUsers = false;
      }
    },

    async updateUser(id: string, params: UserUpdateParams) {
      try {
        this.loadingUsers = true;

        // Call the webservice
        const response = await webservice.updateUser(
          id,
          getUpdatedAttributes(this.currentFetchedUser, params)
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        uiStore().showSnackbar({
          color: 'success',
          message: 'Successfully updated the user.',
        });
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: 'There was an error in updating the user.',
        });
      } finally {
        this.loadingUsers = false;
      }
    },

    async deleteUser(id: string) {
      try {
        this.loadingUsers = true;

        const response = await webservice.deleteUser(id);

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        uiStore().showSnackbar({
          color: 'success',
          message: 'Successfully deleted the user.',
        });
      } catch (e) {
        if (e instanceof Error) {
          uiStore().showSnackbar({
            color: 'error',
            message: e.message,
          });
        } else {
          uiStore().showSnackbar({
            color: 'error',
            message: 'There was an error in deleting the user.',
          });
        }
      } finally {
        this.loadingUsers = false;
      }
    },

    async onTableAction({ id, action }: { id: string; action: string }) {
      switch (action) {
        case 'delete':
          return { id, delete: true };
        case 'active':
          await this.updateUser(id, { isActive: true });
          break;
        case 'inactive':
          await this.updateUser(id, { isActive: false });
          break;
        default:
          break;
      }

      return null;
    },
  },
});
