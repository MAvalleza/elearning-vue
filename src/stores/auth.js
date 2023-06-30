import { defineStore } from 'pinia';
import { signUpUser, loginUser } from '@/webservices/authWebservice';
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
      const response = await loginUser(data);
  
      if (isEmpty(response.errors)) {
        return this.currentUser = response;
      }

      throw new Error(response.errors[0]);
    },
    async logoutUser() {
      this.currentUser = null;
    }
  },
});
