const { RESTDataSource } = require("apollo-datasource-rest");

class UserService extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:9010/";
  }

  async listAllUsers() {
    console.log(`READING ALL USERS FROM '${this.baseURL}'`);
    return this.get(`users`);
  }

  async getUser(id) {
    console.log(`READING USER WITH ID '${id}' FROM '${this.baseURL}'`);
    return this.get(`users/${id}`);
  }
}

module.exports = UserService;
