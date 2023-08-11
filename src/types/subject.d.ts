type Subject = {
  id: string;
  title: string;
  isPublished: boolean;
  description: string;

  courseIds?: string[];
}

interface MappedSubject extends Subject {
  status?: string;
  totalCourses?: number;
}

interface SubjectCreateParams {
  title: string;
  isPublished: boolean;
  description?: string;
}

export {
  Subject,
  SubjectCreateParams,
  MappedSubject,
};