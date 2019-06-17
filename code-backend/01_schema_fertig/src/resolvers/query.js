module.exports = {
  ping: () => `Hello, World @ ${new Date().toLocaleTimeString()}`,
  users: async (_s, _a, { dataSources }) => {
    return dataSources.userDataSource.listAllUsers();
  },
  user: async (_s, { id }, { dataSources }) => {
    return dataSources.userDataSource.getUser(id);
  }

  // TODO: --------------------------------------------------------------------------
  // Implementiere den 'projects' und den 'project' resolver
  //
  // HINWEISE:
  //   - Die Signatur der Methoden findest Du auf den Slides
  //
  //   - Die DataSource zum Lesen der Projekte heißt 'projectDatasource' am Context
  //
  //   - Die DataSource-Klasse ist in 'ProjectSQLiteDataSource', dort findest Du
  //     die Methoden, die Du zum Lesen der Daten aufrufen kannst
  //
  //   - Die Methoden an der DataSource-Klasse liefern die Daten bereits in dem
  //     Format, dass an der GraphQL Schnittstelle erwartet wird. Du kannst
  //     sie also einfach zurückgeben, ohne sie verändern/aufbereiten zu müssen
  // ---------------------------------------------------------------------------------
  //
  //  'projects': liefert pauschal ALLE Projekte aus der Datenbank
  //  'project: liefert genau EIN Projekt (oder null) aus der Datenbank. Das gesuchte
  //            Projekt wird dem Resolver mit dem Argument 'id' übergeben
};
