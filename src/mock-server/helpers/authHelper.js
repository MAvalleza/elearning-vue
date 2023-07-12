class AuthSession {
  constructor (schema, token) {
    this.schema = schema;
    this.token = token;

    this.session = schema.sessions.findBy({ accessToken: token });
  }

  user () {
    if (!this.session) {
      return;
    }

    return this.schema.users.findBy({ email: this.session.email });
  }

  isAuthorized() {
    return this.session && this.user();
  }
}

export { AuthSession }