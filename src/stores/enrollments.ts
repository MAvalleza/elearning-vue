import { defineStore } from 'pinia';
import { useUI as uiStore } from './ui';
import EnrollmentsWebservice from '@/webservices/enrollmentsWebservice';
import isEmpty from 'lodash-es/isEmpty';
import type {
  FetchEnrollmentsParams,
  EnrollmentCreateParams,
  GetEnrollmentParams,
  MappedEnrollment,
  EnrollmentUpdateParams,
} from '@/types/enrollment';
import type { Module } from '@/types/module';
import type { Course } from '@/types/course';

const webservice = new EnrollmentsWebservice();

type CurrentLesson = {
  enrollmentId: string;
  course: Course;
  module: Module;
};

export const useEnrollments = defineStore('enrollments', {
  state: () => ({
    enrollments: [],
    enrollmentsTotal: 0,
    enrollmentsCurrentPage: 1,
    loadingEnrollments: false,
    currentEnrollment: <MappedEnrollment>{},
    currentLesson: <CurrentLesson>{},
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
        this.enrollmentsCurrentPage = response.page;

        return this.enrollments;
      } catch (e) {
        if (e instanceof Error) {
          uiStore().showSnackbar({
            color: 'error',
            message: e.message,
          });
        } else {
          uiStore().showSnackbar({
            color: 'error',
            message: 'There was an error.',
          });
        }

        return [];
      } finally {
        this.loadingEnrollments = false;
      }
    },
    async createEnrollment(params: EnrollmentCreateParams) {
      try {
        this.loadingEnrollments = true;
        const response = await webservice.createEnrollment(params);

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        uiStore().showSnackbar({
          color: 'success',
          message: 'Successfully enrolled.',
        });
      } catch (e) {
        if (e instanceof Error) {
          uiStore().showSnackbar({
            color: 'error',
            message: e.message,
          });
        } else {
          uiStore().showSnackbar({
            color: 'error',
            message: 'There was an error in enrolling.',
          });
        }
      } finally {
        this.loadingEnrollments = false;
      }
    },
    async unenroll(id: string) {
      try {
        this.loadingEnrollments = true;

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
        this.loadingEnrollments = false;
      }
    },
    async fetchEnrollment({ id, params }: { id: string, params: GetEnrollmentParams }) {
      try {
        this.loadingEnrollments = true;

        const response = await webservice.getEnrollment({
          id,
          params,
        });

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        this.currentEnrollment = response;
        return response;
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: 'There was an error in fetching this course',
        });
      } finally {
        this.loadingEnrollments = false;
      }
    },
    async updateEnrollment({ id, data }: { id: string, data: EnrollmentUpdateParams }) {
      try {
        this.loadingEnrollments = true;

        const response = await webservice.updateEnrollment({ id, data });

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: 'There was an error in updating the enrollment',
        });
      } finally {
        this.loadingEnrollments = false;
      }
    },
    setCurrentLesson(lesson: CurrentLesson) {
      this.currentLesson = lesson;
    },
    clearCurrentEnrollment() {
      this.currentEnrollment = <MappedEnrollment>{};
      this.currentLesson = <CurrentLesson>{};
    },
  },
});
