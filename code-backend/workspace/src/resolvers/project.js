module.exports = {
  owner: async (project, _, { dataSources }) => {
    // 1+n Problem when the query asks for more than one project 😱
    //     (more or less solved thx to the fact, that the userDataSource caches)
    return dataSources.userDataSource.getUser(project._ownerId);
  },
  category: async (project, _, { dataSources }) => {
    if (project.category) {
      console.log(`fyi: category on project '${project.id}' already loaded!`);
      return project.category;
    }
    // 1+n problem for fetching categories 😱
    return dataSources.projectDatasource.getCategoryById(project._categoryId);
  },

  tasks: async (project, _args, { dataSources }) => {
    return dataSources.projectDatasource.getTasks(project.id);
  },

  task: async (project, { id }, { dataSources }) => {
    // too many requests to database when tasks and task is included in a query and both contain
    // the same task 😱
    if (project.task && project.task.id === id) {
      return project.task;
    }
    return dataSources.projectDatasource.getTaskById(id);
  }
};
