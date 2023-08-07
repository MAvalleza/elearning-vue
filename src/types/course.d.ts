import { type User } from './user';
import { type Module } from './module';

interface Course {
  id?: string
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

export { Course };
