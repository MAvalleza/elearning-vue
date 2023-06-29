import { defineStore } from 'pinia';
import { signUpUser, loginUser } from '@/webservices/authWebservice';
import pick from 'lodash-es/pick';

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
      const userData = pick(data, [
        'email',
        'password',
        'role',
        'firstName',
        'lastName',
      ]);

      return await signUpUser(userData);
    },
    async loginUser(data) {
      this.currentUser = await loginUser(data);
    },
    async logoutUser() {
      this.currentUser = null;
    }
  },
});
