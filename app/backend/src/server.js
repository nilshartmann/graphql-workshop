const { ApolloServer, PubSub } = require("apollo-server");

const typeDefs = require("./schema");
const UserRESTDataSource = require("./datasources/UserRESTDataSource");
const ProjectDBDataSource = require("./datasources/ProjectDBDataSource");

const pubsub = new PubSub();

const resolvers = {
  Query: require("./resolvers/query"),
  Mutation: require("./resolvers/mutation"),
  Subscription: require("./resolvers/subscription"),
  Project: require("./resolvers/project"),
  Task: require("./resolvers/task")
};

const server = new ApolloServer({
  typeDefs,

  resolvers,

  context: () => ({
    pubsub
  }),

  dataSources: () => ({
    userDataSource: new UserRESTDataSource(),
    projectDatasource: new ProjectDBDataSource()
  }),

  playground: {
    // Playground runs at http://localhost:4000
    settings: {
      "editor.theme": "light",
      "schema.polling.enable": false
    }
  }
});

server.listen().then(({ url }) => {
  console.log(`  Server ready at ${url}`);
});
