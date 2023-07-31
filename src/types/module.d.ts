import { type Course } from './course';
import { Delta } from '@vueup/vue-quill';

interface Module {
  title: string,
  duration: number,
  isPublished: boolean,
  createdAt?: number,
  updatedAt?: number,

  courseTitle?: string,
  course?: Course,
  courseId?: string,

  status?: string

  content?: Delta | object
}