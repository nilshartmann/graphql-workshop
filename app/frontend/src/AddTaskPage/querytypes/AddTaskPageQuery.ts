/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AddTaskPageQuery
// ====================================================

export interface AddTaskPageQuery_project {
  __typename: "Project";
  id: string;
  title: string;
}

export interface AddTaskPageQuery_users {
  __typename: "User";
  name: string;
  id: string;
}

export interface AddTaskPageQuery {
  project: AddTaskPageQuery_project | null;
  users: AddTaskPageQuery_users[];
}

export interface AddTaskPageQueryVariables {
  projectId: string;
}
