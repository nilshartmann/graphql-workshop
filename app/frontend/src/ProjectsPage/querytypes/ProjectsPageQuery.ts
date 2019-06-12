/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ProjectsPageQuery
// ====================================================

export interface ProjectsPageQuery_projects_owner {
  __typename: "User";
  name: string;
}

export interface ProjectsPageQuery_projects_category {
  __typename: "Category";
  name: string;
}

export interface ProjectsPageQuery_projects {
  __typename: "Project";
  id: string;
  title: string;
  owner: ProjectsPageQuery_projects_owner;
  category: ProjectsPageQuery_projects_category;
}

export interface ProjectsPageQuery {
  projects: ProjectsPageQuery_projects[];
}
