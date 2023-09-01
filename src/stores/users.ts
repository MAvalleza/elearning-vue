import { defineStore } from 'pinia';
import UsersWebservice from '@/webservices/usersWebservice';
import { useUI as uiStore } from '@/stores/ui';
import isEmpty from 'lodash-es/isEmpty';
import type { MappedUser, FetchUsersParams } from '@/types/user';

const webservice = new UsersWebservice();

export const useUsers = defineStore('users', {
  state: () => ({
    users: <MappedUser[]>[],
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
            message: 'There was an error in fetching users'
          });
        }
        
        return [];
      } finally {
        this.loadingUsers = false;
      }
    },
  },
});
