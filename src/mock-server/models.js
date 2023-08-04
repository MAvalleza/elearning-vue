import { Model, belongsTo, hasMany } from 'miragejs';

// Define model relationships
export default {
  user: Model.extend({
    subjects: hasMany('subject'),
    courses: hasMany('course'),
    modules: hasMany('module'),
    contents: hasMany('content'),
    enrollments: hasMany('enrollment'),
  }),

  enrollment: Model.extend({
    user: belongsTo('user'),
    course: belongsTo('course'),
    enrollmentModules: hasMany('enrollmentModule'),
  }),

  subject: Model.extend({
    owner: belongsTo('user'),
    courses: hasMany('course'),
  }),

  course: Model.extend({
    author: belongsTo('user'),
    subject: belongsTo('subject'),
    modules: hasMany('module'),
    enrollments: hasMany('enrollment'),
  }),

  module: Model.extend({
    author: belongsTo('user'),
    course: belongsTo('course'),
    contents: hasMany('content'),
    enrollmentModules: hasMany('enrollmentModule'),
  }),

  content: Model.extend({
    author: belongsTo('user'),
    module: belongsTo('module'),
  }),

  enrollmentModule: Model.extend({
    module: belongsTo('module'),
    enrollment: belongsTo('enrollment'),
  }),

  activationToken: Model,
  resetPasswordRequest: Model,
  session: Model,
};
