const TASK_STATES = ["NEW", "RUNNING", "FINISHED"];

function projectFromRow(row) {
  return {
    id: row.id,
    description: row.description,
    title: row.title,
    // category-id and owner-id are not exposed through graphql
    // but we need them in the specialized resolvers
    // to load the 'real' objects
    _categoryId: row.category_id,
    _ownerId: row.owner_id,
    category: row.category_name
      ? {
          name: row.category_name,
          id: row.category_id
        }
      : undefined,
    task: row.task_id ? taskFromRow(row, "task_") : undefined
  };
}

function toIsoString(candidate) {
  return typeof candidate === "string" ? candidate : candidate.toISOString();
}

function taskFromRow(row, prefix = "") {
  const task = {
    id: row[`${prefix}id`],
    title: row[`${prefix}title`],
    description: row[`${prefix}description`],
    state: TASK_STATES[row[`${prefix}state`]],
    toBeFinishedAt: toIsoString(row[`${prefix}finish_date`]),
    _assigneeId: row[`${prefix}assignee_id`].toString(),
    _projectId: row[`${prefix}project_id`].toString()
  };

  return task;
}

function taskStateToDb(taskState) {
  return TASK_STATES.findIndex(candidate => candidate === taskState);
}

module.exports = {
  projectFromRow,
  taskFromRow,
  taskStateToDb
};
