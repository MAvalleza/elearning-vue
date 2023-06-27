import { defineStore } from 'pinia';
import { signUpUser } from '@/webservices/usersWebservice';
import pick from 'lodash-es/pick'

export const useAuth = defineStore('auth', {
  state: () => ({
    currentUser: null,
  }),
  actions: {
    async registerUser(data) {
      const userData = pick(data, ['email', 'password', 'role', 'firstName', 'lastName']) 
      const created = await signUpUser(userData);

      console.log('created data', created);
    }
  }
});