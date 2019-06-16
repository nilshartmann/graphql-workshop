const graphqlFields = require("graphql-fields");

function determineQueriesProjectFields(info) {
  const fields = graphqlFields(info, {}, { processArguments: true });

  return {
    withCategory: !!fields.category,
    withTasks: !!fields.tasks,
    withTask: fields.task
      ? { id: fields.task.__arguments[0].id.value }
      : undefined
  };
}

module.exports = {
  ping: () => `Hello, World @ ${new Date().toLocaleTimeString()}`,
  users: async (_s, _a, { dataSources }) => {
    return dataSources.userDataSource.listAllUsers();
  },
  user: async (_s, { id }, { dataSources }) => {
    // here we can be sure that id is not null, as it's defined
    // as a mandatory field in the graphql schema
    return dataSources.userDataSource.getUser(id);
  },

  projects: async (_s, _a, { dataSources }, info) => {
    return dataSources.projectDatasource.listAllProjects(
      determineQueriesProjectFields(info)
    );
  },

  project: async (_s, { id }, { dataSources }, info) => {
    return dataSources.projectDatasource.getProjectById(
      id,
      determineQueriesProjectFields(info)
    );
  }
};
