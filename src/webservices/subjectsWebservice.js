import Webservice from "./base";

export default class SubjectsWebservice extends Webservice {
  async getSubjects(token) {
    const response = await fetch(`${this.apiNamespace()}/subjects`, {
      method: 'GET',
      headers: {
        ...this.requestHeaders(),
        Authorization: token,
      },
    });
  
    return await response.json();
  }
}