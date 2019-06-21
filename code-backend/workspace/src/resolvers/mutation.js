module.exports = {
  addTask: async (_s, { projectId, input }, { dataSources, pubsub }) => {
    const newTask = await dataSources.projectDatasource.addTaskToProject(
      projectId,
      input
    );

    pubsub.publish("NewTaskEvent", { newTask });

    return newTask;
  }
};
