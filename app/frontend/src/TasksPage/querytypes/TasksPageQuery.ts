/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { TaskState } from "./../../global-query-types";

// ====================================================
// GraphQL query operation: TasksPageQuery
// ====================================================

export interface TasksPageQuery_project_tasks_assignee {
  __typename: "User";
  name: string;
}

export interface TasksPageQuery_project_tasks {
  __typename: "Task";
  id: string;
  title: string;
  assignee: TasksPageQuery_project_tasks_assignee;
  state: TaskState;
}

export interface TasksPageQuery_project {
  __typename: "Project";
  title: string;
  id: string;
  tasks: TasksPageQuery_project_tasks[];
}

export interface TasksPageQuery {
  project: TasksPageQuery_project | null;
}

export interface TasksPageQueryVariables {
  projectId: string;
}
