module.exports = {
  addTask: async (_s, { projectId, input }, { dataSources, pubsub }) => {
    const newTask = await dataSources.projectDatasource.addTaskToProject(
      projectId,
      input
    );

    pubsub.publish("NewTaskEvent", { newTask });

    return newTask;
  },

  updateTaskState: async (
    _s,
    { taskId, newState },
    { dataSources, pubsub }
  ) => {
    const updatedTasks = await dataSources.projectDatasource.updateTaskState(
      taskId,
      newState
    );

    pubsub.publish("TaskChangedEvent", { task: updatedTasks });

    return updatedTasks;
  }
};
