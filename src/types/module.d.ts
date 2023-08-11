import type { Content } from './content';
import type { Course } from './course';
import { Delta } from '@vueup/vue-quill';

type Module = {
  id: string;
  title: string;
  duration: number;
  isPublished: boolean;
  createdAt: number | Date | null;
  updatedAt: number | Date | null;

  // Populated
  course: Course;
}

interface MappedModule extends Module {
  courseTitle?: string;
  courseId?: string;

  status?: string;

  content?: Delta | File | object;
}
interface ModuleCreateParams {
  title: string;
  isPublished: boolean;
  duration: number;
  authorId: string;
  courseId: string;
  content?: Content['content'];
}

interface ModuleUpdateParams {
  title?: string;
  isPublished?: boolean;
  duration?: number;
  courseId?: string;
}

export {
  Module,
  MappedModule,
  ModuleCreateParams,
  ModuleUpdateParams,
}