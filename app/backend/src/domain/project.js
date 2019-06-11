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
      : undefined
  };
}

class ProjectDBDataSource extends DataSource {
  initialize(_config) {
    this.pool = new Pool({
      user: "klaus",
      host: "localhost",
      database: "project_db",
      password: "secretpw",
      port: 9432
    });

    this.pool.on("error", (error, _client) => {
      console.error("Error in PG Pool: ", error);
    });

    // this.pool.on("connect", client => {
    //   console.log("fyi: Connection to PG opened!");
    // });
  }

  async listAllProjects(options) {
    console.log("listAllProjects", options);

    const query = options.withCategory
      ? "SELECT p.*, c.name as category_name FROM projects p, categories c WHERE p.category_id = c.id"
      : "SELECT p.* FROM projects p";

    const { rows } = await this.pool.query(query);
    return rows.map(projectFromRow);
  }

  async getProjectById(projectId) {
    const { rows } = await this.pool.query(
      "SELECT * FROM projects WHERE id = $1",
      [projectId]
    );
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

  async getTasks(projectId, page, pageSize) {
    const client = await this.pool.connect();
    try {
      const { rows: taskRows } = await this.pool.query(
        "SELECT * FROM tasks WHERE project_id = $1 ORDER BY id LIMIT $2 OFFSET $3",
        [projectId, pageSize, page * pageSize]
      );

      const { rows: countRows } = await this.pool.query(
        "SELECT count(id) FROM tasks WHERE project_id = $1",
        [projectId]
      );

      return {
        tasks: taskRows.map(taskFromRow),
        totalCount: countRows[0].count
      };
    } catch (e) {
      console.error("ERROR", e);
    } finally {
      client.release();
    }
  }
}

function taskFromRow(row) {
  const STATES = ["NEW", "RUNNING", "FINISHED"];
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    state: STATES[row.state],
    toBeFinishedAt: row.finish_date,
    _assigneeId: row.assignee_id,
    _projectId: row.project_id
  };
}

module.exports = ProjectDBDataSource;
