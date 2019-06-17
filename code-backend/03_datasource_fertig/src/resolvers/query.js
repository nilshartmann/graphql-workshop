module.exports = {
  ping: () => `Hello, World @ ${new Date().toLocaleTimeString()}`,
  users: async (_s, _a, { dataSources }) => {
    return dataSources.userDataSource.listAllUsers();
  },
  user: async (_s, { id }, { dataSources }) => {
    return dataSources.userDataSource.getUser(id);
  },
  projects: async (_s, _a, { dataSources }) => {
    return dataSources.projectDatasource.getAllProjects();
  },

  project: async (_s, { id }, { dataSources }) => {
    return dataSources.projectDatasource.getProjectById(id);
  }
};
