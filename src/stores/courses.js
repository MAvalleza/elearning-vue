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
  }),
  actions: {
    async fetchCourses(params) {
      try {
        uiStore().setLoading(true);

        const currentUser = authStore().currentUser;

        const response = await webservice.getCourses(
          params,
          currentUser.accessToken,
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        const mappedCourses = response.results.map(course => ({
          ...course,
          status: course.isPublished ? 'Published' : 'Draft',
          subjectTitle: course.subject.title,
          authorName: `${course.author.firstName} ${course.author.lastName}`,
          totalModules: size(course.moduleIds),
        }));

        this.courses = mappedCourses;
        this.coursesTotal = response.count;

        return mappedCourses;
      } catch (e) {
        console.error(e);

        uiStore().showSnackbar({
          color: 'error',
          message: e.message,
        });
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
          currentUser.accessToken,
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        uiStore().showSnackbar({
          color: 'success',
          message: 'Successfully updated the course.',
        });
      } catch (e) {
        console.error(e);
  
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
          currentUser.accessToken,
        );

        if (!isEmpty(response.errors)) {
          throw Error(response.errors[0]);
        }

        uiStore().showSnackbar({
          color: 'success',
          message: 'Successfully deleted the course.',
        });
      } catch (e) {
        console.error(e);
  
        uiStore().showSnackbar({
          color: 'error',
          message: 'There was an error in deleting the course.',
        });
      } finally {
        uiStore().setLoading(false);
      }
    }
  },
});
