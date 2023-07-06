import { defineStore } from 'pinia';
import {
  getSubjects
} from '@/webservices/subjectsWebservice';
import { useUI as uiStore } from './ui';
import { useAuth as authStore } from './auth'
import isEmpty from 'lodash-es/isEmpty';

export const useSubjects = defineStore('subjects', {
  state: () => ({
    subjects: [],
    subjectsTotal: 0,
  }),
  actions: {
    // TODO: Filters
    async fetchSubjects() {
      try {
        uiStore().setLoading(true);

        const currentUser = authStore().currentUser;

        const response = await getSubjects(currentUser.accessToken);

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        const mappedSubjects = response.results.map(subject => ({
          ...subject,
          status: subject.isPublished ? 'Published' : 'Draft',
          coursesLength: subject.courseIds.length,
        }));

        this.subjects = mappedSubjects;
        this.subjectsTotal = response.count;

        return mappedSubjects;
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
