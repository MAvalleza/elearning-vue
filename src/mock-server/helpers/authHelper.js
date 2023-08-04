import { ROLES } from '@/constants/roles-and-actions';
class AuthSession {
  constructor(schema, token) {
    this.schema = schema;
    this.token = token;

    this.session = schema.sessions.findBy({ accessToken: token });
  }

  user() {
    if (!this.session) {
      return;
    }

    return this.schema.users.findBy({ email: this.session.email });
  }

  isAuthorized({ resource, resourceId } = {}) {
    // If an id is given but unknown resource
    if (resourceId && !resource) {
      return false;
    }

    // Admin can access
    if (this.isAdmin()) {
      return true;
    }

    // Simply checks if user exists
    if (!resourceId) {
      return this.session && this.user();
    }

    // Checks if user has access to the resource
    return !!this.user()[resource].models.find(
      model => model.id === resourceId
    );
  }

  isAdmin() {
    return this.user().role === ROLES.ADMIN;
  }

  isInstructor() {
    return this.user().role === ROLES.INSTRUCTOR;
  }

  isStudent() {
    return this.user().role === ROLES.STUDENT;
  }
}

export { AuthSession };
