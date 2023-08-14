import { defineStore } from 'pinia';
import { useUI as uiStore } from './ui';
import EnrollmentsWebservice from '@/webservices/enrollmentsWebservice';
import isEmpty from 'lodash-es/isEmpty';
import type { FetchEnrollmentsParams, EnrollmentCreateParams } from '@/types/enrollment';

const webservice = new EnrollmentsWebservice();

export const useEnrollments = defineStore('enrollments', {
  state: () => ({
    enrollments: [],
    enrollmentsTotal: 0,
    loadingEnrollments: false,
  }),
  actions: {
    async fetchEnrollments(params: FetchEnrollmentsParams) {
      try {
        this.loadingEnrollments = true;

        const response = await webservice.getEnrollments(params);

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        this.enrollments = response.data;
        this.enrollmentsTotal = response.totalCount;

        return this.enrollments;
      } catch (e) {
        if (e instanceof Error) {
          uiStore().showSnackbar({
            color: 'error',
            message: e.message,
          });
        }

        return [];
      } finally {
        this.loadingEnrollments = false;
      }
    },
    async createEnrollment(params: EnrollmentCreateParams) {
      try {
        const response = await webservice.createEnrollment(params);

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        uiStore().showSnackbar({
          color: 'success',
          message: 'Successfully enrolled.',
        });
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: 'There was an error in enrolling.',
        });
      } finally {
        uiStore().setLoading(false);
      }
    },
    async unenroll(id: string) {
      try {
        const response = await webservice.deleteEnrollment(id);

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        uiStore().showSnackbar({
          color: 'success',
          message: 'Successfully unenrolled.',
        });
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: 'There was an error in unenrolling',
        });
      } finally {
        uiStore().setLoading(false);
      }
    },
  },
});
