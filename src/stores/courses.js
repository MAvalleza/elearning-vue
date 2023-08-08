import { defineStore } from 'pinia';
import CoursesWebservice from '@/webservices/coursesWebservice';
import { useUI as uiStore } from './ui';
import { useAuth as authStore } from './auth';
import isEmpty from 'lodash-es/isEmpty';
import size from 'lodash-es/size';

const webservice = new CoursesWebservice();

export const useCourses = defineStore('courses', {
  state: () => ({
    courses: [],
    coursesTotal: 0,
    currentCourse: {},
  }),
  actions: {
    async fetchCourses(params) {
      try {
        uiStore().setLoading(true);

        const currentUser = authStore().currentUser;

        const response = await webservice.getCourses(
          params,
          currentUser.accessToken
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        const mappedCourses = response.data.map(course => ({
          ...course,
          status: course.isPublished ? 'Published' : 'Draft',
          ...(course.subject && { subjectTitle: course.subject.title }),
          ...(course.author && {
            authorName: `${course.author.firstName} ${course.author.lastName}`,
          }),
          ...(course.modules && {
            totalDuration: course.modules.reduce(
              (acc, i) => acc + i.duration,
              0
            ),
          }),
          totalModules: size(course.moduleIds),
        }));

        this.courses = mappedCourses;
        this.coursesTotal = response.totalCount;

        return mappedCourses;
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: e.message,
        });
      } finally {
        uiStore().setLoading(false);
      }
    },
    async createCourse(data) {
      try {
        uiStore().setLoading(true);

        const currentUser = authStore().currentUser;

        const response = await webservice.createCourse(
          data,
          currentUser.accessToken
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        uiStore().showSnackbar({
          color: 'success',
          message: 'Successfully created the course.',
        });
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: 'There was an error in creating the course.',
        });
        // this.$router.push({ name: 'courses-list' });
      } finally {
        uiStore().setLoading(false);
      }
    },

    async updateCourse(id, params) {
      try {
        uiStore().setLoading(true);

        const currentUser = authStore().currentUser;

        const response = await webservice.updateCourse(
          id,
          params,
          currentUser.accessToken
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        uiStore().showSnackbar({
          color: 'success',
          message: 'Successfully updated the course.',
        });
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: 'There was an error in updating the course.',
        });

        this.$router.push({ name: 'courses-list' });
      } finally {
        uiStore().setLoading(false);
      }
    },
    async deleteCourse(id) {
      try {
        uiStore().setLoading(true);

        const currentUser = authStore().currentUser;

        const response = await webservice.deleteCourse(
          id,
          currentUser.accessToken
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        uiStore().showSnackbar({
          color: 'success',
          message: 'Successfully deleted the course.',
        });
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: 'There was an error in deleting the course.',
        });
      } finally {
        uiStore().setLoading(false);
      }
    },
    async fetchCourse(id, params) {
      try {
        uiStore().setLoading(true);

        const currentUser = authStore().currentUser;

        const response = await webservice.getCourse(
          {
            id,
            params,
          },
          currentUser.accessToken
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        this.currentCourse = response;
      } catch (e) {
        uiStore().showSnackbar({
          color: 'error',
          message: 'There was an error in fetching the course.',
        });
      } finally {
        uiStore().setLoading(false);
      }
    },
    async onTableAction({ id, action }) {
      switch (action) {
        case 'delete':
          return { id, delete: true };
        case 'publish':
          await this.updateCourse(id, { isPublished: true });
          break;
        case 'draft':
          await this.updateCourse(id, { isPublished: false });
          break;
        default:
          break;
      }
    },
  },
});
