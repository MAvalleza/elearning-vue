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
    if (resourceId && !resource) {
      return false;
    }

    if (!resourceId) {
      return this.session && this.user();
    }

    // Checks if user has access to the resource
    return !!this.user()[resource].models.find(
      model => model.id === resourceId
    );
  }
}

export { AuthSession };
