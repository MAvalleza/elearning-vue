import { defineStore } from 'pinia';
import { useUI as uiStore } from './ui';
import EnrollmentsWebservice from '@/webservices/enrollmentsWebservice';
import { useAuth as authStore } from './auth';
import isEmpty from 'lodash-es/isEmpty';

const webservice = new EnrollmentsWebservice();

export const useEnrollments = defineStore('enrollments', {
  state: () => ({
    enrollments: [],
    enrollmentsTotal: 0,
    loadingEnrollments: false,
  }),
  actions: {
    async createEnrollment(params) {
      try {
        const currentUser = authStore().currentUser;

        const response = await webservice.createEnrollment(
          params,
          currentUser.accessToken
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        uiStore().showSnackbar({
          color: 'success',
          message: 'Successfully enrolled.',
        });
      } catch (e) {
        console.error(e);
        uiStore().showSnackbar({
          color: 'error',
          message: 'There was an error in enrolling.',
        });
      } finally {
        uiStore().setLoading(false);
      }
    },
  },
});
