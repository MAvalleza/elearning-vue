import { type User } from './user';

interface Course {
  title: string;
  description?: string;
  icon?: string;
  isPublished: boolean;
  createdAt?: number;
  updatedAt?: number | null;
  subject?: object;

  authorName?: string;
  author?: User;

  modules?: object[];
  totalModules?: number;
  moduleIds: (number | string)[];
}

export { Course };
