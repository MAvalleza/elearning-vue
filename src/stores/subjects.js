import { defineStore } from 'pinia';
import SubjectsWebservice from '@/webservices/subjectsWebservice';
import { useUI as uiStore } from './ui';
import { useAuth as authStore } from './auth'
import isEmpty from 'lodash-es/isEmpty';
import size from 'lodash-es/size';

const webservice = new SubjectsWebservice();

export const useSubjects = defineStore('subjects', {
  state: () => ({
    subjects: [],
    subjectsTotal: 0,
  }),
  actions: {
    // TODO: Filters
    async fetchSubjects(params) {
      try {
        uiStore().setLoading(true);

        const currentUser = authStore().currentUser;

        const response = await webservice.getSubjects(
          currentUser.accessToken,
          params,
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        const mappedSubjects = response.results.map(subject => ({
          ...subject,
          status: subject.isPublished ? 'Published' : 'Draft',
          coursesLength: size(subject.courseIds),
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
