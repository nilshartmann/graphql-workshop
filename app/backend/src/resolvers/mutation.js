module.exports = {
  addTask: async (_s, { projectId, input }, { dataSources, pubsub }) => {
    if (!input.toBeFinishedAt) {
      // set default date if none is specified
      const toBeFinishedAt = new Date();
      toBeFinishedAt.setDate(toBeFinishedAt.getDate() + 14);
      input.toBeFinishedAt = toBeFinishedAt.toISOString();
    }

    // Make sure specified user exists in userservice
    const user = await dataSources.userDataSource.getUser(input.assigneeId);
    if (!user) {
      throw new Error(`Unknown assignee with id '${input.assigneeId}'`);
    }

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
