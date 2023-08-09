import { FetchParams } from "./params";

interface FetchEnrollmentsParams extends FetchParams {
  subjectId?: string
}

interface EnrollmentCreateParams {
  courseId: string,
}

export { FetchEnrollmentsParams, EnrollmentCreateParams }