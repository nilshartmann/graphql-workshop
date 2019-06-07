const { ApolloServer } = require("apollo-server");
const schema = require("./schema");
const UserService = require("./domain/users");
const ProjectDBDataSource = require("./domain/project");

function helloWorld() {
  return "Hello, World!";
}

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

    projects: async (_s, _a, { dataSources }) => {
      return dataSources.projectDatasource.listAllProjects();
    },

    project: async (_s, { id }, { dataSources }) => {
      return dataSources.projectDatasource.getProjectById(id);
    }
  },
  Project: {
    owner: async (project, _, { dataSources }) => {
      // 1+n Problem when the query asks for more than one project 😱
      //     (more or less solved thx to the fact, that the userservice caches)
      return dataSources.userservice.getUser(project._ownerId);
    },
    category: async (project, _, { dataSources }) => {
      // 1+n problem for fetching categories 😱
      return dataSources.projectDatasource.getCategoryById(project._categoryId);
    },

    tasks: async (project, { page = 0, pageSize = 10 }, { dataSources }) => {
      const {
        tasks,
        totalCount
      } = await dataSources.projectDatasource.getTasks(
        project.id,
        page,
        pageSize
      );

      const totalPageCount = Math.ceil(totalCount / pageSize);

      return {
        page: {
          page,
          totalCount,
          totalPageCount,
          hasNextPage: page < totalPageCount - 1,
          hasPreviousPage: page > 0
        },
        nodes: tasks
      };
    },

    task: async (_project, { id }, { dataSources }) => {
      // too many requests to database when tasks and task is included in a query and both contain
      // the same task 😱
      return dataSources.projectDatasource.getTaskById(id);
    }
  },
  Task: {
    project: async (task, _, { dataSources }) => {
      // Here we load again the project, that we already have loaded (otherwise we wouldn't have the task) 😱
      return dataSources.projectDatasource.getProjectById(task._projectId);
    },
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
      userservice: new UserService(),
      projectDatasource: new ProjectDBDataSource()
    };
  }
});

server.listen().then(({ url }) => {
  console.log(`  Server ready at ${url}`);
});
