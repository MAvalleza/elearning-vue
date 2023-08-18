import { ROLES } from '@/constants/roles-and-actions';
class AuthSession {
  constructor(schema, token) {
    this.schema = schema;
    // Remove bearer keyword
    this.token = getToken(token);

    this.session = schema.sessions.findBy({ accessToken: this.token });
  }

  user() {
    return this.schema.users.findBy({ email: this.session.email });
  }

  isExpiredToken() {
    return this.session.expiresAt < Date.now();
  }

  isAuthorized({ resource, resourceId } = {}) {
    // If no session was found, then it is not allowed
    if (!this.session) {
      return false;
    }

    // If the token is expired, delete the record and return false
    if (this.isExpiredToken()) {
      this.schema.db.sessions.remove({ accessToken: this.token });
      return false;
    }

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
      return !!this.user();
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

// Removes the `Bearer` prefix
function getToken(tokenString) {
  return tokenString.replace('Bearer ', '');
};

export { AuthSession, getToken };
