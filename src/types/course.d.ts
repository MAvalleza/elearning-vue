interface Course {
  title: string,
  description?: string,
  icon?: string,
  isPublished: boolean,
  createdAt?: number,
  updatedAt?: number | null,
  subject?: object,
  modules?: object[],
}

export { Course }