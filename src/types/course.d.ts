import type { Module } from './module';
import { type FetchParams } from './params';
import type { Subject } from './subject';
import type { Author } from './user';

type Course = {
  id: string;
  title: string;
  description?: string;
  icon?: string | File;
  isPublished: boolean;
  createdAt: number | Date | null;
  updatedAt: number | Date | null;

  // Populated
  subject: Subject;
  author: Author;
  modules?: Module[];

  // 
  moduleIds?: (number | string)[];
}

interface MappedCourse extends Course {
  authorName?: string;

  totalModules?: number;
  totalDuration?: number;
}

interface FetchCoursesParams extends FetchParams {
  subjectId?: string | null;
  sections?: boolean;
}

interface GetCourseParams {
  join: string[],
}

interface CourseCreateParams {
  title: Course['title'];
  description?: Course['description'];
  icon?: Course['icon'];
  isPublished: Course['isPublished'];
  authorId: string;
  subjectId: string;
}

export {
  Course,
  MappedCourse,
  FetchCoursesParams,
  CourseCreateParams,
  GetCourseParams
};
