import { defineStore } from 'pinia';
import SubjectsWebservice from '@/webservices/subjectsWebservice';
import { useUI as uiStore } from './ui';
import { useAuth as authStore } from './auth';
import isEmpty from 'lodash-es/isEmpty';
import size from 'lodash-es/size';

const webservice = new SubjectsWebservice();

export const useSubjects = defineStore('subjects', {
  state: () => ({
    subjects: [],
    subjectsTotal: 0,
    currentSubject: {},
  }),
  actions: {
    async fetchSubjects(params) {
      try {
        uiStore().setLoading(true);

        const currentUser = authStore().currentUser;

        const response = await webservice.getSubjects(
          params,
          currentUser.accessToken,
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        const mappedSubjects = response.results.map(subject => ({
          ...subject,
          status: subject.isPublished ? 'Published' : 'Draft',
          totalCourses: size(subject.courseIds),
        }));

        this.subjects = mappedSubjects;
        this.subjectsTotal = response.count;

        return mappedSubjects;
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: e.message,
        });
      } finally {
        uiStore().setLoading(false);
      }
    },
    async createSubject(params) {
      try {
        uiStore().setLoading(true);

        const currentUser = authStore().currentUser;

        const response = await webservice.createSubject(
          params,
          currentUser.accessToken
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        uiStore().showSnackbar({
          color: 'success',
          message: 'Successfully created a subject.',
        });

        // Redirect to edit subject details
        this.$router.push({
          name: 'edit-subject',
          params: { subjectId: response.id },
        });
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: 'There was an error in creating your subject.',
        });
      } finally {
        uiStore().setLoading(false);
      }
    },
    async fetchSubject(id, params) {
      try {
        uiStore().setLoading(true);

        const currentUser = authStore().currentUser;

        const response = await webservice.getSubject(
          {
            id,
            params,
          },
          currentUser.accessToken
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        this.currentSubject = response;
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: 'There was an error in fetching the subject.',
        });

        this.$router.push({ name: 'subjects-list' });
      } finally {
        uiStore().setLoading(false);
      }
    },
    async updateSubject(id, params) {
      try {
        uiStore().setLoading(true);

        const currentUser = authStore().currentUser;

        const response = await webservice.updateSubject(
          id,
          params,
          currentUser.accessToken
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        uiStore().showSnackbar({
          color: 'success',
          message: 'Successfully updated the subject.',
        });
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: 'There was an error in updating the subject.',
        });

        this.$router.push({ name: 'subjects-list' });
      } finally {
        uiStore().setLoading(false);
      }
    },
    async deleteSubject(id) {
      try {
        uiStore().setLoading(true);

        const currentUser = authStore().currentUser;

        const response = await webservice.deleteSubject(
          id,
          currentUser.accessToken
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        uiStore().showSnackbar({
          color: 'success',
          message: 'Successfully deleted the subject.',
        });
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: 'There was an error in deleting the subject.',
        });
      } finally {
        uiStore().setLoading(false);
      }
    },
  },
});
