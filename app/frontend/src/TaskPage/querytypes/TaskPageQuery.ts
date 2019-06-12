/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TaskState } from "./../../global-query-types";

// ====================================================
// GraphQL query operation: TaskPageQuery
// ====================================================

export interface TaskPageQuery_project_task_assignee {
  __typename: "User";
  name: string;
}

export interface TaskPageQuery_project_task {
  __typename: "Task";
  id: string;
  title: string;
  description: string;
  assignee: TaskPageQuery_project_task_assignee;
  toBeFinishedAt: string;
  state: TaskState;
}

export interface TaskPageQuery_project {
  __typename: "Project";
  id: string;
  title: string;
  task: TaskPageQuery_project_task | null;
}

export interface TaskPageQuery {
  project: TaskPageQuery_project | null;
}

export interface TaskPageQueryVariables {
  projectId: string;
  taskId: string;
}
