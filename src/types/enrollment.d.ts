import { FetchParams } from "./params";

interface FetchEnrollmentsParams extends FetchParams {
  subjectId?: string
}

interface EnrollmentDataParams {
  courseId: string,
}

export { FetchEnrollmentsParams, EnrollmentDataParams }