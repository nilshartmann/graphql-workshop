const { withFilter } = require("apollo-server");

module.exports = {
  onNewTask: {
    resolve(payload) {
      return payload.newTask;
    },
    subscribe: withFilter(
      (_s, _a, { pubsub }) => pubsub.asyncIterator("NewTaskEvent"),
      (payload, variables) => {
        return variables.projectId
          ? variables.projectId === payload.newTask._projectId
          : true;
      }
    )
  },
  onTaskChange: {
    resolve(payload) {
      return payload.task;
    },
    subscribe: withFilter(
      (_s, _a, { pubsub }) => pubsub.asyncIterator("TaskChangedEvent"),
      (payload, variables) => {
        return variables.projectId
          ? variables.projectId === payload.task._projectId
          : true;
      }
    )
  }
};
