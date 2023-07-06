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
    enrollment_modules: hasMany('enrollment_module'),
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
    enrollment_modules: hasMany('enrollment_module'),
  }),

  content: Model.extend({
    author: belongsTo('user'),
    module: belongsTo('module'),
  }),

  enrollment_module: Model.extend({
    module: belongsTo('module'),
    enrollment: belongsTo('enrollment'),
  }),

  resetPasswordRequest: Model,
  session: Model,
};
