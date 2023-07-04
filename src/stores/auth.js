import { defineStore } from 'pinia';
import {
  signUpUser,
  loginUser,
  logoutUser,
  requestResetPassword,
  resetPassword,
} from '@/webservices/authWebservice';
import { useUI as uiStore } from '@/stores/ui';
import pick from 'lodash-es/pick';
import isEmpty from 'lodash-es/isEmpty';

export const useAuth = defineStore('auth', {
  state: () => ({
    currentUser: null,
  }),
  getters: {
    isAuthenticated(state) {
      return !!state.currentUser;
    },
  },
  actions: {
    async registerUser(data) {
      try {
        uiStore().setLoading(true);
  
        const userData = pick(data, [
          'email',
          'password',
          'role',
          'firstName',
          'lastName',
        ]);
  
        const response = await signUpUser(userData);
  
        if (!isEmpty(response.errors)) {
          throw new Error(response.errors[0]);
        }

        return response;
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
    async loginUser(data) {
      try {
        uiStore().setLoading(true);

        const response = await loginUser(data);
  
        if (isEmpty(response.errors)) {
          this.currentUser = response;
          uiStore().setLoading(false);

          this.$router.push({ name: 'index' });

          return;
        }
  
        throw new Error(response.errors[0]);
      } catch (e) {
        console.error(e);

        uiStore().showSnackbar({
          color: 'error',
          message: e.message,
        });

        uiStore().setLoading(false);
      }
    },
    async logoutUser() {
      await logoutUser();

      this.$router.push({ name: 'login' });
    },

    async requestResetPassword(data) {
      try {
        uiStore().setLoading(true);

        const response = await requestResetPassword(data);

        if (!isEmpty(response.errors)) {
          throw new Error(response.errors[0]);
        }

        uiStore().showSnackbar({
          color: 'success',
          message: 'A reset password link was sent to your email.',
        });

        return response;
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
    async resetPassword(token, { password }) {
      try {
        uiStore().setLoading(true);

        const response = await resetPassword(token, { password });

        if (!isEmpty(response.errors)) {
          throw new Error(response.errors[0]);
        }

        uiStore().showSnackbar({
          color: 'success',
          message: 'Password reset successful.',
        });

      } catch (e) {
        console.error(e);

        uiStore().showSnackbar({
          color: 'error',
          message: e.message,
        });
      } finally {
        uiStore().setLoading(false);

        this.$router.push({ name: 'login' });
      }
    }
  },
});
