import type { Subject } from './subject';
import type { Course } from './course';
import type { FetchParams } from './params';
import type { MappedModule } from './module';

type Enrollment = {
  id: string;
  createdAt: number | Date | null;
  updatedAt: number | Date | null;
  userId: string;
  courseId: string;
}

interface MappedEnrollment extends Enrollment {
  course?: Course;
  subject?: Subject;
  modules: MappedModule[];
}

interface FetchEnrollmentsParams extends FetchParams {
  subjectId?: string;
  completed?: boolean;
}

interface EnrollmentCreateParams {
  courseId: string,
}

interface GetEnrollmentParams {
  join?: string[]
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
}