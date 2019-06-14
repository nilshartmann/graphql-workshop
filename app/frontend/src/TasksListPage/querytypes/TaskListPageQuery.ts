/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TaskState } from "./../../global-query-types";

// ====================================================
// GraphQL query operation: TaskListPageQuery
// ====================================================

export interface TaskListPageQuery_project_tasks_assignee {
  __typename: "User";
  name: string;
}

export interface TaskListPageQuery_project_tasks {
  __typename: "Task";
  id: string;
  title: string;
  assignee: TaskListPageQuery_project_tasks_assignee;
  state: TaskState;
}

export interface TaskListPageQuery_project {
  __typename: "Project";
  title: string;
  id: string;
  tasks: TaskListPageQuery_project_tasks[];
}

export interface TaskListPageQuery {
  project: TaskListPageQuery_project | null;
}

export interface TaskListPageQueryVariables {
  projectId: string;
}
