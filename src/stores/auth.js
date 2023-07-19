import { defineStore } from 'pinia';
import AuthWebservice from '@/webservices/authWebservice';
import { useUI as uiStore } from '@/stores/ui';
import pick from 'lodash-es/pick';
import isEmpty from 'lodash-es/isEmpty';

const webservice = new AuthWebservice();

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

        const response = await webservice.signUpUser(userData);

        if (!isEmpty(response.errors)) {
          throw new Error(response.errors.message);
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
        console.error(e);

        uiStore().showSnackbar({
          color: 'error',
          message: e.message,
        });

        uiStore().setLoading(false);
      }
    },
    async logoutUser() {
      if (!this.currentUser) return;

      const token = this.currentUser.accessToken;

      await webservice.logoutUser(token);

      localStorage.removeItem('accessToken');

      this.$router.push({ name: 'login' });
    },

    async requestResetPassword(data) {
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

        const response = await webservice.resetPassword(token, { password });

        if (!isEmpty(response.errors)) {
          throw new Error(response.errors.message);
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
    },
    async activateAccount(token) {
      try {
        uiStore().setLoading(true);

        const response = await webservice.activateAccount({ token });

        if (!isEmpty(response.errors)) {
          throw new Error(response.errors.message);
        }

        return true;
      } catch (e) {
        console.error(e);

        return false;
      } finally {
        uiStore().setLoading(false);
      }
    },
    async resendVerification(data) {
      uiStore().setLoading(true);

      const response = await webservice.createVerification(data);

      uiStore().setLoading(false);

      return response;
    },
  },
});
