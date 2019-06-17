// TODO ----------------------------------------------------------------
//
// Implementiere den 'tasks' und 'task' resolver
//
//   - Als Source erhalten diese Resolver ein Project object
//   - Die benötigten Informationen (tasks bzw ein task) können
//     über die projectDatasource gelesen werden:
//       getTasks bzw getTaskById(id)
//  - Zur Erinnerung siehe im Schema nach, wie task bzw tasks
//    Feld auf dem Project Type definiert sind
//
const Project = {
  owner: async (project, _args, { dataSources }) => {
    return dataSources.userDataSource.getUser(project._ownerId);
  },
  category: async (project, _args, { dataSources }) => {
    return dataSources.projectDatasource.getCategoryById(project._categoryId);
  },

  tasks: async (project, _args, { dataSources }) => {
    return dataSources.projectDatasource.getTasks(project.id);
  },

  task: async (_source, { id }, { dataSources }) => {
    return dataSources.projectDatasource.getTaskById(id);
  }
};

// TODO ----------------------------------------------------------------
//      Erst wenn das Schema vollständig ist, kann dieser Resolver
//      aktiviert werden.
//      Dazu das Project-Objekt als 'exports' setzen:
//      module.exports = { Project };
module.exports = { Project };
