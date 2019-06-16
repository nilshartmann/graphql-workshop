const { DataSource } = require("apollo-datasource");
const sqlite = require("sqlite");
const fs = require("fs");
const path = require("path");

const { projectFromRow, taskFromRow, taskStateToDb } = require("./mapping");

/**
 * An SQLite-backed DataSource. Does NOT support query "optimization"
 * to eager load complete object graphs (i.e. projects with all tasks)
 * depending on the query
 */
class ProjectSQLiteDataSource extends DataSource {
  constructor() {
    super();

    this.database = createDatabase();
  }

  async getAllProjects() {
    const rows = await this.database.all("SELECT * FROM projects ORDER BY id");
    return rows.map(projectFromRow);
  }

  async getProjectById(projectId) {
    const row = await this.database.get("SELECT * FROM projects WHERE id = ?", [
      projectId
    ]);

    if (!row) {
      return;
    }

    return projectFromRow(row);
  }

  async getCategoryById(categoryId) {
    const row = await this.database.get(
      "SELECT * FROM categories WHERE id = ?",
      [categoryId]
    );

    return row;
  }

  async getTaskById(taskId) {
    const row = await this.database.get("SELECT * FROM tasks WHERE id = $1", [
      taskId
    ]);

    if (!row) {
      return;
    }

    return taskFromRow(row);
  }

  async getTasks(projectId) {
    const rows = await this.database.all(
      "SELECT * FROM tasks WHERE project_id = ?",
      [projectId]
    );

    return rows.map(r => taskFromRow(r, ""));
  }

  async addTaskToProject(projectId, input) {
    try {
      await this.database.run(
        "INSERT INTO tasks (state, project_id, description, title, finish_date, assignee_id) VALUES (0, ?, ?, ?, ?, ?)",
        [
          projectId,
          input.description,
          input.title,
          input.toBeFinishedAt,
          input.assigneeId
        ]
      );

      const { newTaskId } = await this.database.get(
        "SELECT last_insert_rowid() AS newTaskId"
      );
      return this.getTaskById(newTaskId);
    } catch (e) {
      console.error("UPDATE FAILED: " + e, e);
    }
  }

  async updateTaskState(taskId, newState) {
    await this.database.run("UPDATE tasks SET state = $1 WHERE id = ?", [
      taskStateToDb(newState),
      taskId
    ]);

    return this.getTaskById(taskId);
  }
}

function initDatabase(db) {
  return db
    .get("SELECT name FROM sqlite_master WHERE type='table' AND name='tasks';")
    .then(tableExists => {
      if (tableExists) {
        return db;
      }
      console.log("CREATING DATABASE");
      const content = fs.readFileSync(
        path.resolve("./src/datasources/init-sqlite.sql"),
        "utf8"
      );

      return db.exec(content).then(_ => {
        console.log("DB CREATED");
        return db;
      });
    });
}

class Database {
  constructor(dbPromise) {
    this.dbPromise = dbPromise;
  }

  async get(sql, args) {
    const db = await this.dbPromise;
    return db.get(sql, args);
  }

  async all(sql, args) {
    const db = await this.dbPromise;
    return db.all(sql, args);
  }

  async run(sql, args) {
    const db = await this.dbPromise;
    return db.run(sql, args);
  }
}

function createDatabase() {
  const dbPromise = sqlite.open("./db.sqlite", { verbose: true });
  dbPromise
    .then(initDatabase)
    .then(db =>
      db.driver.on("trace", query => console.log(`Executed Query: ${query}`))
    );
  return new Database(dbPromise);
}

module.exports = ProjectSQLiteDataSource;
