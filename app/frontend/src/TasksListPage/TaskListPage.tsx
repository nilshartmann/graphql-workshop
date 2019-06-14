import NavButton from "../components/NavButton";
import styles from "./TaskListPage.module.scss";
import Button from "../components/Button";
import { ChevronRight } from "@primer/octicons-react";
import * as React from "react";
import { useNavigator } from "../infra/NavigationProvider";
import gql from "graphql-tag";
import { RouteComponentProps } from "react-router";
import { TaskListPageQuery, TaskListPageQuery_project_tasks, TaskListPageQueryVariables } from "./querytypes/TaskListPageQuery";
import { mapTaskState } from "../util/mapper";
import { useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";

const TASK_LIST_PAGE_QUERY = gql`
  query TaskListPageQuery($projectId: ID!) {
    project(id: $projectId) {
      title
      id
      tasks {
        id
        title
        assignee {
          name
        }
        state
      }
    }
  }
`;

const TASK_CHANGE_SUBSCRIPTION = gql`
  subscription TaskChangeSubscription($projectId: ID!) {
    onTaskChange(projectId: $projectId) {
      id
      state
    }
  }
`;

type TasksPageTableProps = {
  projectId: string;
  tasks: TaskListPageQuery_project_tasks[];
};
function TasksTable({ projectId, tasks }: TasksPageTableProps) {
  const navigator = useNavigator();

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Assignee</th>
          <th>State</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {tasks.map(task => {
          return (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.assignee.name}</td>
              <td>{mapTaskState(task.state)}</td>
              <td>
                <NavButton onClick={() => navigator.openTaskPage(projectId, task.id)} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

type TaskListPageProps = RouteComponentProps<{ projectId: string }>;

export default function TaskListPage(props: TaskListPageProps) {
  const projectId = props.match.params.projectId;
  const navigator = useNavigator();

  const { loading, error, data, subscribeToMore } = useQuery<TaskListPageQuery, TaskListPageQueryVariables>(
    TASK_LIST_PAGE_QUERY,
    {
      fetchPolicy: "cache-and-network",
      variables: { projectId }
    }
  );

  React.useEffect(() => {
    if (subscribeToMore && projectId) {
      return subscribeToMore({
        document: TASK_CHANGE_SUBSCRIPTION,
        variables: { projectId }
      });
    }
  }, [projectId, subscribeToMore]);

  if (loading) {
    return <h2>Loading...</h2>;
  }
  if (error || !data) {
    return <h2>Sorry... Something failed while loading data </h2>;
  }

  if (!data.project) {
    return <h2>Project not found!</h2>;
  }

  return (
    <div className={styles.TaskListPage}>
      <header>
        <h1>
          <Link to="/">All Projects</Link> > {data.project.title} Tasks
        </h1>
      </header>
      <TasksTable projectId={data.project.id} tasks={data.project.tasks} />
      <div className={styles.ButtonBar}>
        <Button onClick={e => navigator.openAddTaskPage(projectId)} icon={ChevronRight}>
          Add Task
        </Button>
      </div>
    </div>
  );
}
