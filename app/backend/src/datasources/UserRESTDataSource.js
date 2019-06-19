const { RESTDataSource } = require("apollo-datasource-rest");

class UserRESTDataSource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:4010/";
  }

  listAllUsers() {
    console.log(`READING ALL USERS FROM '${this.baseURL}'`);
    return this.get(`users`);
  }

  getUser(id) {
    console.log(`READING USER WITH ID '${id}' FROM '${this.baseURL}'`);
    // this method is invoked each time a user is requested
    // BUT: the actual remote call to the REST service might not be done
    //      due to cache-headers received from a previous call
    //      https://stackoverflow.com/a/53362001/6134498

    return this.get(`users/${id}`) //
      .catch(err => {
        if (getStatusCode(err) === 404) {
          return null;
        }
        console.error("READING REST API FAILED", err);
        throw err;
      });
  }
}

function getStatusCode(err) {
  // https://github.com/apollographql/apollo-server/issues/1833
  if (err && err.extensions && err.extensions.response) {
    return err.extensions.response.status;
  }
}

module.exports = UserRESTDataSource;
