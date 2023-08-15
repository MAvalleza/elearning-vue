import { defineStore } from 'pinia';
import SubjectsWebservice from '@/webservices/subjectsWebservice';
import { useUI as uiStore } from './ui';
import isEmpty from 'lodash-es/isEmpty';
import size from 'lodash-es/size';
import type { FetchParams, GetParams } from '@/types/params';
import type { Subject, MappedSubject, SubjectCreateParams } from '@/types/subject';

const webservice = new SubjectsWebservice();

export const useSubjects = defineStore('subjects', {
  state: () => ({
    subjects: <MappedSubject[]>[],
    subjectsTotal: 0,
    currentSubject: {} as Subject,
    loadingSubjects: false,
  }),
  actions: {
    async fetchSubjects(params: FetchParams) {
      try {
        this.loadingSubjects = true;

        const response = await webservice.getSubjects(params);

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        const mappedSubjects = mapSubjects(response.data);

        this.subjects = mappedSubjects;
        this.subjectsTotal = response.totalCount;

        return mappedSubjects;
      } catch (e) {
        if (e instanceof Error) {
          uiStore().showSnackbar({
            color: 'error',
            message: e.message,
          });
        }
      } finally {
        this.loadingSubjects = false;
      }
    },
    async createSubject(params: SubjectCreateParams) {
      try {
        uiStore().setLoading(true);

        const response = await webservice.createSubject(params);

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
    async fetchSubject(id: string, params: GetParams) {
      try {
        uiStore().setLoading(true);

        const response = await webservice.getSubject(
          {
            id,
            params,
          },
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
    async updateSubject(id: string, params: Partial<SubjectCreateParams>) {
      try {
        uiStore().setLoading(true);

        const response = await webservice.updateSubject(
          id,
          params,
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
    async deleteSubject(id: string) {
      try {
        uiStore().setLoading(true);

        const response = await webservice.deleteSubject(id);

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
    async onTableAction({ id, action }: { id: string, action: string }) {
      switch (action) {
        case 'delete':
          return { id, delete: true };
        case 'publish':
          await this.updateSubject(id, { isPublished: true });
          break;
        case 'draft':
          await this.updateSubject(id, { isPublished: false });
          break;
        default:
          break;
      }
    },
  },
});

function mapSubjects(subjects: Subject[]) {
  return subjects.map(subject => ({
    ...subject,
    status: subject.isPublished ? 'Published' : 'Draft',
    totalCourses: size(subject.courseIds),
  }));
}