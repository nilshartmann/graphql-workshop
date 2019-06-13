const { ApolloServer, PubSub, withFilter } = require("apollo-server");
const graphqlFields = require("graphql-fields");
const schema = require("./schema");
const UserService = require("./domain/users");
const ProjectDBDataSource = require("./domain/project");

function helloWorld(_source, _args) {
  return `Hello, World @ ${new Date().toLocaleTimeString()}`;
}

const pubsub = new PubSub();

const resolvers = {
  Query: {
    ping: helloWorld,
    users: async (_s, _a, { dataSources }) => {
      return dataSources.userservice.listAllUsers();
    },
    user: async (_s, { id }, { dataSources }) => {
      // here we can be sure that id is not null, as it's defined
      // as a mandatory field in the graphql schema
      return dataSources.userservice.getUser(id);
    },

    projects: async (_s, _a, { dataSources }, info) => {
      const fields = graphqlFields(info, {}, { processArguments: true });

      return dataSources.projectDatasource.listAllProjects({
        withCategory: !!fields.category,
        withTasks: !!fields.tasks,
        withTask: fields.task
          ? { id: fields.task.__arguments[0].id.value }
          : undefined
      });
    },

    project: async (_s, { id }, { dataSources }, info) => {
      const fields = graphqlFields(info, {}, { processArguments: true });

      return dataSources.projectDatasource.getProjectById(id, {
        withCategory: !!fields.category,
        withTasks: !!fields.tasks,
        withTask: fields.task
          ? { id: fields.task.__arguments[0].id.value }
          : undefined
      });
    }
  },
  Mutation: {
    // addTask(projectId: ID!, input: AddTaskInput!): Task!
    addTask: async (_s, { projectId, input }, { dataSources }) => {
      const newTask = await dataSources.projectDatasource.addTaskToProject(
        projectId,
        input
      );

      pubsub.publish("NewTaskEvent", { newTask });

      return newTask;
    },
    updateTaskState: async (_s, { taskId, newState }, { dataSources }) => {
      const updatedTasks = await dataSources.projectDatasource.updateTaskState(
        taskId,
        newState
      );

      pubsub.publish("TaskChangedEvent", { task: updatedTasks });

      return updatedTasks;
    }
  },

  Subscription: {
    onNewTask: {
      resolve(payload, _s, _a, _c) {
        return payload.newTask;
      },
      subscribe: () => {
        return pubsub.asyncIterator("NewTaskEvent");
      }
    },
    onTaskChange: {
      resolve(payload, _s, _a, _c) {
        return payload.task;
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator("TaskChangedEvent"),
        (payload, variables) => {
          return variables.projectId
            ? variables.projectId === payload.task._projectId
            : true;
        }
      )
    }
  },

  Project: {
    owner: async (project, _, { dataSources }) => {
      // 1+n Problem when the query asks for more than one project 😱
      //     (more or less solved thx to the fact, that the userservice caches)
      return dataSources.userservice.getUser(project._ownerId);
    },
    category: async (project, _, { dataSources }) => {
      if (project.category) {
        console.log(`fyi: category on project '${project.id}' already loaded!`);
        return project.category;
      }
      // 1+n problem for fetching categories 😱
      return dataSources.projectDatasource.getCategoryById(project._categoryId);
    },

    tasks: async (project, _args, { dataSources }) => {
      return dataSources.projectDatasource.getTasks(project.id);
    },

    task: async (project, { id }, { dataSources }) => {
      // too many requests to database when tasks and task is included in a query and both contain
      // the same task 😱
      if (project.task && project.task.id === id) {
        return project.task;
      }
      return dataSources.projectDatasource.getTaskById(id);
    }
  },
  Task: {
    assignee: async (task, _, { dataSources }) => {
      return dataSources.userservice.getUser(task._assigneeId);
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  dataSources: () => {
    return {
      userservice: new UserService("http://localhost:4010/"),
      projectDatasource: new ProjectDBDataSource({
        user: "klaus",
        host: "localhost",
        database: "project_db",
        password: "secretpw",
        port: 4432
      })
    };
  },
  playground: {
    settings: {
      "editor.theme": "light",
      "schema.polling.enable": false
    }
  }
});

server.listen().then(({ url }) => {
  console.log(`  Server ready at ${url}`);
});
