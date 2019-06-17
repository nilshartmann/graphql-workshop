module.exports = {
  assignee: async (task, _, { dataSources }) => {
    return dataSources.userDataSource.getUser(task._assigneeId);
  }
};
