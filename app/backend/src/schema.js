const { gql } = require("apollo-server");

module.exports = gql`
  directive @skipCache on FIELD | FRAGMENT_DEFINITION | FRAGMENT_SPREAD | INLINE_FRAGMENT | QUERY

  type User {
    id: ID!

    # The login is used by the user to log in to our System
    login: String!

    # The human readable name of the person
    name: String!

    # For Debugging: a unique "id" that is generate inside the Userservice for each request
    # Having this id one can verify if a resource comes from the apollo cache
    # (that is requestId does not change) or if it's actually (re-)fetched from the service
    requestId: String!
  }

  type Project {
    id: ID!

    # A a simple, concise title for your project
    title: String!

    # A description of this project in deep detail so others can
    # unterstand the goals and constraints of this project.
    description: String!

    # The project owner
    owner: User!

    category: Category!

    # You split your Project into several tasks that you
    # have to work on to finish this Project's goal
    tasks: [Task!]!

    # Get a task by it's unique id. Return null if that
    # task could not be found
    task(id: ID!): Task
  }

  # Projects are ground into user-defined categories
  # (like 'Private', 'Business', 'Hobby',...)
  type Category {
    id: ID!
    name: String!
  }

  enum TaskState {
    NEW
    RUNNING
    FINISHED
  }

  # A Task is part of a Project. It represents an actual
  # task of a Tasks that needs to be fulfilled
  # to complete the Project
  type Task {
    id: ID!

    # A concicse title of this task, that describes what to do
    title: String!

    # A complete and detailed description what should be done in this task.
    # The description should be understandable also by people that are not
    # familiar with this task, so they can get into without having
    # to ask for further details
    description: String!
    state: TaskState!

    # Who works on this Task or should work on the task
    assignee: User!

    toBeFinishedAt: String!
  }

  type Query {
    """
    Returns hello world when the server is running
    """
    ping: String!
    users: [User!]!
    user(id: ID!): User

    # Return an unordered list of all projects
    # Everyone can actually SEE any projects without
    # being logged in. Only modifications to a project
    # (or Task) can be done when logged in
    projects: [Project!]!

    # Return the specified project
    project(id: ID!): Project
  }

  input AddTaskInput {
    title: String!
    description: String!
    toBeFinishedAt: String!
    assigneeId: ID!
  }

  type Mutation {
    addTask(projectId: ID!, input: AddTaskInput!): Task!
    updateTaskState(taskId: ID!, newState: TaskState): Task!
  }

  type Subscription {
    onNewTask: Task!
    onTaskChange(projectId: ID): Task!
  }
`;
