export const SUBJECT_FIXTURES = [
  {
    title: 'Mathematics',
    isPublished: true,
    createdAt: Date.now(),
    updatedAt: null,
    courses: [
      {
        title: 'Elementary Math',
        description: 'A basic course',
        // icon: 'mdi-bookshelf',
        isPublished: true,
        createdAt: Date.now(),
        updatedAt: null,
        modules: [
          {
            title: 'Basic Operations',
            duration: 120,
            isPublished: true,
            createdAt: Date.now(),
            updatedAt: null,
          },
          {
            title: 'Fractions',
            duration: 90,
            isPublished: false,
            createdAt: Date.now(),
            updatedAt: null,
          }
        ]
      },
      {
        title: 'Algebra',
        description: 'A basic algebra course',
        // icon: 'mdi-bookshelf',
        isPublished: false,
        createdAt: Date.now(),
        updatedAt: null,
        modules: [
          {
            title: 'Number line',
            duration: 60,
            isPublished: true,
            createdAt: Date.now(),
            updatedAt: null,
          }
        ]
      }
    ]
  },
  {
    title: 'Science',
    isPublished: true,
    createdAt: Date.now(),
    updatedAt: null,
    courses: [
      {
        title: 'Biology',
        description: 'A biological course',
        // icon: 'mdi-bookshelf',
        isPublished: true,
        createdAt: Date.now(),
        updatedAt: null,
        modules: []
      }
    ]
  },
  {
    title: 'History',
    isPublished: false,
    createdAt: Date.now(),
    updatedAt: null,
  },
]