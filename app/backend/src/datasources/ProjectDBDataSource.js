const { DataSource } = require("apollo-datasource");
const { Pool, Query } = require("pg");

// Very basic Postgres SQL logging
// https://github.com/brianc/node-postgres/issues/433#issuecomment-472332408
const submit = Query.prototype.submit;
Query.prototype.submit = function() {
  const text = this.text;
  const values = this.values || [];
  const query = text.replace(/\$([0-9]+)/g, (m, v) =>
    JSON.stringify(values[parseInt(v) - 1])
  );
  console.log(`Executing Query: ${query}`);
  submit.apply(this, arguments);
};

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

class ProjectDBDataSource extends DataSource {
  constructor() {
    super();
    this.config = {
      user: "klaus",
      host: "localhost",
      database: "project_db",
      password: "secretpw",
      port: 4432
    };
  }
  initialize(_config) {
    this.pool = new Pool(this.config);

    this.pool.on("error", (error, _client) => {
      console.error("Error in PG Pool: ", error);
    });

    // this.pool.on("connect", client => {
    //   console.log("fyi: Connection to PG opened!");
    // });
  }

  async listAllProjects(options = {}) {
    console.log("listAllProjects", options);

    const query = buildProjectsQuery(options);

    const { rows } = await this.pool.query(...query);
    return rows.map(projectFromRow);
  }

  async getProjectById(projectId, options = {}) {
    const query = buildProjectsQuery(options, projectId);
    const { rows } = await this.pool.query(...query);
    if (rows.length === 0) {
      return null;
    }

    return projectFromRow(rows[0]);
  }

  async getCategoryById(categoryId) {
    const { rows } = await this.pool.query(
      "SELECT * FROM categories WHERE id = $1",
      [categoryId]
    );
    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async getTaskById(taskId) {
    const { rows } = await this.pool.query(
      "SELECT * FROM tasks WHERE id = $1",
      [taskId]
    );
    if (rows.length === 0) {
      return null;
    }

    return taskFromRow(rows[0]);
  }

  async getTasks(projectId) {
    const { rows: taskRows } = await this.pool.query(
      "SELECT * FROM tasks WHERE project_id = $1",
      [projectId]
    );

    return taskRows.map(r => taskFromRow(r, ""));
  }

  async addTaskToProject(projectId, input) {
    const client = await this.pool.connect();
    try {
      const seqResult = await client.query("SELECT nextval('task_id_seq')");

      const newTaskId = seqResult.rows[0].nextval;
      await client.query(
        "INSERT INTO tasks (state, id, project_id, description, title, finish_date, assignee_id) VALUES (0, $1, $2, $3, $4, $5, $6)",
        [
          newTaskId,
          projectId,
          input.description,
          input.title,
          input.toBeFinishedAt,
          input.assigneeId
        ]
      );

      return this.getTaskById(newTaskId);
    } catch (e) {
      console.error("UPDATE FAILED: " + e, e);
    } finally {
      client.release();
    }
  }

  async updateTaskState(taskId, newState) {
    await this.pool.query("UPDATE tasks SET state = $1 WHERE id = $2", [
      TASK_STATES.findIndex(taskState => taskState === newState),
      taskId
    ]);

    return this.getTaskById(taskId);
  }
}
function taskFromRow(row, prefix = "") {
  const task = {
    id: row[`${prefix}id`],
    title: row[`${prefix}title`],
    description: row[`${prefix}description`],
    state: TASK_STATES[row[`${prefix}state`]],
    toBeFinishedAt: row[`${prefix}finish_date`].toISOString(),
    _assigneeId: row[`${prefix}assignee_id`],
    _projectId: row[`${prefix}project_id`]
  };

  return task;
}

/** Build "optimized" Query using JOINs for a GraphQL request that selects
 * 'task' and/or 'category' field.
 *
 * Note: selecting 'tasks' always requires a second SQL select. Would
 * be possible to optimize this also here, but for demo purposes
 * it's not neccessary
 */
function buildProjectsQuery(options, projectId) {
  let selector = projectId ? "p.id=$1 AND " : "";
  const values = projectId ? [projectId] : [];
  if (options.withTask) {
    const taskId = options.withTask.id;
    if (projectId) {
      selector += "t.id=$2 AND ";
    } else {
      selector += " t.id=$1 AND ";
    }

    values.push(taskId);
  }

  const TASK_FIELDS =
    "t.id as task_id, t.title as task_title, t.description as task_description, t.state as task_state, t.finish_date as task_finish_date, t.assignee_id as task_assignee_id, t.project_id as task_project_id";
  const CATEGORY_FIELDS = "c.name as category_name";

  if (options.withCategory) {
    if (options.withTask) {
      return [
        `SELECT p.*, ${TASK_FIELDS}, ${CATEGORY_FIELDS} FROM projects p, categories c, tasks t WHERE ${selector}p.category_id = c.id AND t.project_id = p.id`,
        values
      ];
    }
    return [
      `SELECT p.*, ${CATEGORY_FIELDS} FROM projects p, categories c WHERE ${selector}p.category_id = c.id`,
      values
    ];
  }

  if (options.withTask) {
    return [
      `SELECT p.*, ${TASK_FIELDS} FROM projects p, tasks t WHERE ${selector} t.project_id = p.id`,
      values
    ];
  }

  return [
    `SELECT p.* FROM projects p${projectId ? " WHERE p.id=$1" : ""}`,
    values
  ];
}

module.exports = ProjectDBDataSource;
