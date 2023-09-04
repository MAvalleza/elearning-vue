type Subject = {
  id: string;
  title: string;
  isPublished: boolean;

  courseIds?: string[];
};

interface MappedSubject extends Subject {
  status?: string;
  totalCourses?: number;
}

interface SubjectCreateParams {
  title: string;
  isPublished: boolean;
}

export { Subject, SubjectCreateParams, MappedSubject };
