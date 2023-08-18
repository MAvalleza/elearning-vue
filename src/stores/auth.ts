import { defineStore } from 'pinia';
import AuthWebservice from '@/webservices/authWebservice';
import { useUI as uiStore } from '@/stores/ui';
import pick from 'lodash-es/pick';
import isEmpty from 'lodash-es/isEmpty';
import type { User, CurrentUser, FetchUsersParams, UserCreateParams } from '@/types/user';
import type { LoginCredentials, PasswordRequest } from '@/types/auth';

const webservice = new AuthWebservice();

export const useAuth = defineStore('auth', {
  state: () => ({
    currentUser: <CurrentUser>{},
    users: <User[]>[],
    usersTotal: 0,
    usersCurrentPage: 1,
    loadingUsers: false,
  }),
  getters: {
    isAuthenticated(state) {
      return !isEmpty(state.currentUser);
    },
    currentUserRole(state) {
      return state.currentUser?.role;
    },
    hasPreviousSession() {
      return !!localStorage.getItem('accessToken');
    }
  },
  actions: {
    async fetchUsers(params: FetchUsersParams) {
      try {
        this.loadingUsers = true;

        const response = await webservice.getUsers(params);

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        this.users = mapUsers(response.data);
        this.usersTotal = response.totalCount;
        this.usersCurrentPage = response.page;

        return this.users;
      } catch (e) {
        if (e instanceof Error) {
          uiStore().showSnackbar({
            color: 'error',
            message: e.message,
          });
        }
        
        return [];
      } finally {
        this.loadingUsers = false;
      }
    },
    async registerUser(data: UserCreateParams) {
      try {
        uiStore().setLoading(true);

        const userData = pick(data, [
          'email',
          'password',
          'role',
          'firstName',
          'lastName',
        ]);

        const response = await webservice.signUpUser(userData);

        if (!isEmpty(response.errors)) {
          throw new Error(response.errors.message);
        }

        return response;
      } catch (e) {
        if (e instanceof Error) {
          uiStore().showSnackbar({
            color: 'error',
            message: e.message,
          });
        }
      } finally {
        uiStore().setLoading(false);
      }
    },
    async loginUser(data: LoginCredentials) {
      try {
        uiStore().setLoading(true);

        const response = await webservice.loginUser(data);

        if (isEmpty(response.errors)) {
          this.currentUser = response;
          localStorage.setItem('accessToken', response.accessToken);

          uiStore().setLoading(false);

          this.$router.push({ name: 'index' });

          return;
        }

        throw new Error(response.errors.message);
      } catch (e) {
        if (e instanceof Error) {
          uiStore().showSnackbar({
            color: 'error',
            message: e.message,
          });
        }

        uiStore().setLoading(false);
      }
    },
    async logoutUser() {
      if (!this.currentUser) return;

      await webservice.logoutUser();

      localStorage.removeItem('accessToken');

      this.$router.push({ name: 'login' });
    },

    async requestResetPassword(data: PasswordRequest) {
      try {
        uiStore().setLoading(true);

        const response = await webservice.requestResetPassword(data);

        if (!isEmpty(response.errors)) {
          throw new Error(response.errors.message);
        }

        uiStore().showSnackbar({
          color: 'success',
          message: 'A reset password link was sent to your email.',
        });

        return response;
      } catch (e) {
        if (e instanceof Error) {
          uiStore().showSnackbar({
            color: 'error',
            message: e.message,
          });
        }
      } finally {
        uiStore().setLoading(false);
      }
    },
    async resetPassword({ password }: { password: string }, token: string) {
      try {
        uiStore().setLoading(true);

        const response = await webservice.resetPassword({ password }, token);

        if (!isEmpty(response.errors)) {
          throw new Error(response.errors.message);
        }

        uiStore().showSnackbar({
          color: 'success',
          message: 'Password reset successful.',
        });
      } catch (e) {
        if (e instanceof Error) {
          uiStore().showSnackbar({
            color: 'error',
            message: e.message,
          });
        }
      } finally {
        uiStore().setLoading(false);

        this.$router.push({ name: 'login' });
      }
    },
    async activateAccount(token: string) {
      try {
        uiStore().setLoading(true);

        const response = await webservice.activateAccount({ token });

        if (!isEmpty(response.errors)) {
          throw new Error(response.errors.message);
        }

        return true;
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: 'There was an error.',
        });
        return false;
      } finally {
        uiStore().setLoading(false);
      }
    },
    async resendVerification(data: { email: string }) {
      uiStore().setLoading(true);

      const response = await webservice.createVerification(data);

      uiStore().setLoading(false);

      return response;
    },
    async validateSession() {
      try {
        if (!this.hasPreviousSession) {
          return;
        }

        const response = await webservice.validateSession();

        if (!isEmpty(response.errors)) {
          localStorage.removeItem('accessToken');
          throw new Error(response.errors.message);
        }

        this.currentUser = response;
        // Set local storage token to the new token
        localStorage.setItem('accessToken', response.accessToken);
      } catch(e) {
        if (e instanceof Error) {
          uiStore().showSnackbar({
            color: 'error',
            message: e.message
          });
        }
      }
    }
  },
});

function mapUsers(users: User[]) {
  return users.map(user => ({
    ...user,
    normalizedName: `${user.firstName} ${user.lastName}`,
  }));
}
