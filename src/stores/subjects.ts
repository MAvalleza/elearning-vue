import { defineStore } from 'pinia';
import SubjectsWebservice from '@/webservices/subjectsWebservice';
import { useUI as uiStore } from './ui';
import isEmpty from 'lodash-es/isEmpty';
import size from 'lodash-es/size';
import { getUpdatedAttributes } from '@/helpers/paramsHelper';
import type { FetchParams, GetParams } from '@/types/params';
import type { Subject, MappedSubject, SubjectCreateParams } from '@/types/subject';

const webservice = new SubjectsWebservice();

export const useSubjects = defineStore('subjects', {
  state: () => ({
    subjects: <MappedSubject[]>[],
    subjectsTotal: 0,
    subjectsCurrentPage: 1,
    currentSubject: <Subject>{},
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
        this.subjectsCurrentPage = response.page;

        return mappedSubjects;
      } catch (e) {
        if (e instanceof Error) {
          uiStore().showSnackbar({
            color: 'error',
            message: e.message,
          });
        } else {
          uiStore().showSnackbar({
            color: 'error',
            message: 'There was an error.'
          });
        }
      } finally {
        this.loadingSubjects = false;
      }
    },
    async createSubject(params: SubjectCreateParams) {
      try {
        this.loadingSubjects = true;

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
        this.loadingSubjects = false;
      }
    },
    async fetchSubject(id: string, params: GetParams) {
      try {
        this.loadingSubjects = true;

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
        this.loadingSubjects = false;
      }
    },
    async updateSubject(id: string, params: Partial<SubjectCreateParams>) {
      try {
        this.loadingSubjects = true;

        const response = await webservice.updateSubject(
          id,
          getUpdatedAttributes(this.currentSubject, params),
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
        this.loadingSubjects = false;
      }
    },
    async deleteSubject(id: string) {
      try {
        this.loadingSubjects = true;

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
        this.loadingSubjects = false;
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
