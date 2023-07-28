import { type Course } from './course';

interface Module {
  title: string,
  duration: number,
  isPublished: boolean,
  createdAt?: number,
  updatedAt?: number,

  courseTitle?: string,
  course?: Course,

  status?: string
}