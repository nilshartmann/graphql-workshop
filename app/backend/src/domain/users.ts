import { RESTDataSource } from "apollo-datasource-rest";

export default class UserService extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:9010/";
  }

  async listAllUsers() {
    console.log(`READING ALL USERS FROM '${this.baseURL}'`);
    return this.get(`users`);
  }

  async getUser(id: string) {
    console.log(`READING USER WITH ID '${id}' FROM '${this.baseURL}'`);
    return this.get(`users/${id}`);
  }
}
