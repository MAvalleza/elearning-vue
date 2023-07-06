import { defineStore } from 'pinia';
import {
  getSubjects
} from '@/webservices/subjectsWebservice';
import { useUI as uiStore } from './ui';
import { useAuth as authStore } from './auth'
// import isEmpty from 'lodash-es/isEmpty';

export const useSubjects = defineStore('subjects', {
  actions: {
    // TODO: Filters
    async fetchSubjects() {
      try {
        uiStore().setLoading(true);

        const currentUser = authStore().currentUser;

        const response = await getSubjects(currentUser.accessToken);

        console.log('subjects', response);
      } catch (e) {
        console.error(e);

        uiStore().showSnackbar({
          color: 'error',
          message: e.message,
        });
      } finally {
        uiStore().setLoading(false);
      }
    }
  },
});
