const { withFilter } = require("apollo-server");

module.exports = {
  onNewTask: {
    resolve(payload) {
      return payload.newTask;
    },
    subscribe: (_s, _a, { pubsub }) => {
      return pubsub.asyncIterator("NewTaskEvent");
    }
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
