const { RESTDataSource } = require("apollo-datasource-rest");

class UserRESTDataSource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:4010/";
  }

  listAllUsers() {
    console.log(`READING ALL USERS FROM '${this.baseURL}'`);

    // TODO: ------------------------------------------------------------------------
    //
    // Implementiere diese Mehode, um den "/"-Endpunkt im userservice aufrufen und ALLE
    //  User (unverändert) zurückzuliefern
  }

  getUser(id) {
    console.log(`READING USER WITH ID '${id}' FROM '${this.baseURL}'`);

    // TODO: ------------------------------------------------------------------------
    //
    // - Implementiere diese Mehode, um den "/users/ID"-Endpunkt im userservice
    //   aufzurufen
    // - Die id bekommst Du als Parameter übergeben
    // - Das gelesene Objekt unverändert zurückliefern

    // - BONUS: Wenn ein Fehler auftritt (catch-Fall!), mittels getStatusCode
    //          prüfen, ob es ein 404 war und dann null zurückliefern
    //          (ansonsten "throw new Error(...)" o.ä.)
  }
}

function getStatusCode(err) {
  // https://github.com/apollographql/apollo-server/issues/1833
  if (err && err.extensions && err.extensions.response) {
    return err.extensions.response;
  }
}

module.exports = UserRESTDataSource;
