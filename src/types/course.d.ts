import { type User } from './user';
import { type Module } from './module';
import { type FetchParams } from './params';

interface Course {
  id?: string;
  title: string;
  description?: string;
  icon?: string;
  isPublished: boolean;
  createdAt?: number;
  updatedAt?: number | null;
  subject?: object;

  authorName?: string;
  author?: User;

  modules?: Module[];
  totalModules?: number;
  moduleIds?: (number | string)[];
  totalDuration?: number;
}

interface FetchCoursesParams extends FetchParams {
  subjectId?: string
}

interface GetCourseParams {
  join: string[],
}

interface CourseDataParams {
  title?: string;
  description?: string;
  icon?: string;
  isPublished?: boolean;
  authorId?: string;
  subjectId?: string;
}

export { Course, FetchCoursesParams, CourseDataParams, GetCourseParams };
