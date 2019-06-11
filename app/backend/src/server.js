const { ApolloServer } = require("apollo-server");
const responseCachePlugin = require("apollo-server-plugin-response-cache");
const graphqlFields = require("graphql-fields");
const schema = require("./schema");
const UserService = require("./domain/users");
const ProjectDBDataSource = require("./domain/project");

function helloWorld(_source, _args, context, info) {
  const result = "Hello, World! " + new Date().toLocaleTimeString();
  console.log(result);
  console.log("####### context", context);
  console.log("####### info", info.operation);
  return result;
}

// https://github.com/apollographql/apollo-server/issues/2128#issuecomment-449608218

// other approach: https://www.npmjs.com/package/graphql-fields
// recommended by lee bryon (https://github.com/graphql/graphql-js/issues/458#issuecomment-240017575)
const makeFieldList = (fields, relationFields = [], f = {}, rootName) => {
  for (let i = 0; i < fields.length; i++) {
    const val = fields[i].name.value;

    // A misc filter, you can remove this check
    const newRoot = rootName ? `${rootName}.${val}` : val;
    fields[i].selectionSet && relationFields.indexOf(newRoot) === -1
      ? makeFieldList(
          fields[i].selectionSet.selections,
          relationFields,
          f,
          newRoot
        )
      : (f[newRoot] = 1);
  }
  return f;
};

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

      console.log(JSON.stringify(fields, null, 2));

      // console.log("####### info", info);
      return dataSources.projectDatasource.listAllProjects({
        withCategory: !!fields.category
      });
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
      if (project.category) {
        console.log("fyi: category already loaded!");
        return project.category;
      }
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
  },
  plugins: [responseCachePlugin()]
});

server.listen().then(({ url }) => {
  console.log(`  Server ready at ${url}`);
});
