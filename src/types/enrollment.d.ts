import type { Subject } from './subject';
import type { Course } from './course';
import type { FetchParams } from './params';
import type { MappedModule } from './module';
import type { Author } from './user';

type Enrollment = {
  id: string;
  createdAt: number | Date | null;
  updatedAt: number | Date | null;
  userId: string;
  courseId: string;
};

interface MappedEnrollment extends Enrollment {
  course?: Course;
  subject?: Subject;
  modules?: MappedModule[];
  author?: Author;
}

interface FetchEnrollmentsParams extends FetchParams {
  subjectId?: string;
  completed?: boolean;
}

interface EnrollmentCreateParams {
  courseId: string;
}

interface GetEnrollmentParams {
  join?: string[];
}

interface EnrollmentUpdateParams {
  moduleId: string;
  isCompleted: boolean;
}

export {
  FetchEnrollmentsParams,
  EnrollmentCreateParams,
  GetEnrollmentParams,
  EnrollmentUpdateParams,
  MappedEnrollment,
};
