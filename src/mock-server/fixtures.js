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
          },
          {
            title: 'Multiplication table',
            duration: 30,
            isPublished: true,
            createdAt: Date.now(),
            updatedAt: null,
          }
        ],
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
          },
        ],
      },
      {
        title: 'Business Math',
        description: 'A business math course',
        isPublished: true,
        createdAt: Date.now(),
        updatedAt: null,
        modules: [],
      }
    ],
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
        modules: [],
      },
      {
        title: 'Physics',
        description: 'A physics course',
        isPublished: true,
        createdAt: Date.now(),
        updatedAt: null,
        modules: [
          {
            title: 'Newton Laws of Motion',
            duration: 100,
            isPublished: true,
            createdAt: Date.now(),
            updatedAt: null,
          },
          {
            title: 'Albert Einstein',
            duration: 60,
            isPublished: false,
            createdAt: Date.now(),
            updatedAt: null,
          }
        ]
      }
    ],
  },
  {
    title: 'History',
    isPublished: false,
    createdAt: Date.now(),
    updatedAt: null,
  },
  {
    title: 'Geography',
    isPublished: false,
    createdAt: Date.now(),
    updatedAt: null,
    courses: [
      {
        title: 'Asia Geography',
        description: 'Discover geography of Asia',
        isPublished: false,
        createdAt: Date.now(),
        updatedAt: null,
        modules: [
          {
            title: 'Southeast Asia',
            duration: 120,
            isPublished: false,
            createdAt: Date.now(),
            updatedAt: null,
          }
        ]
      }
    ]
  }
];
