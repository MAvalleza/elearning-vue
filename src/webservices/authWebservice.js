import Webservice from "./base";

export default class AuthWebservice extends Webservice {
  async getUsers() {
    const response = await fetch(`${this.apiNamespace()}/users`);
    return await response.json();
  };
  
  async signUpUser(data) {
    const response = await fetch(`${this.apiNamespace()}/signup`, {
      method: 'POST',
      headers: this.requestHeaders(),
      body: JSON.stringify(data),
    });
  
    return await response.json();
  };
  
  async loginUser(data) {
    const response = await fetch(`${this.apiNamespace()}/login`, {
      method: 'POST',
      headers: this.requestHeaders(),
      body: JSON.stringify(data),
    });
  
    return await response.json();
  };
  
  async logoutUser(token) {
    await fetch(`${this.apiNamespace()}/logout`, {
      method: 'DELETE',
      headers: {
        ...this.requestHeaders(),
        Authorization: token,
      },
    });
  };
  
  async requestResetPassword(data) {
    const response = await fetch(`${this.apiNamespace()}/password/?email=${data.email}`, {
      method: 'GET',
      headers: this.requestHeaders(),
    });
    return await response.json();
  };
  
  async resetPassword(token, data) {
    const response = await fetch(`${this.apiNamespace()}/password`, {
      method: 'POST',
      headers: {
        ...this.requestHeaders(),
        Authorization: token,
      },
      body: JSON.stringify(data),
    });
  
    return await response.json();
  };
}
