const { ApolloServer, PubSub } = require("apollo-server");

const typeDefs = require("./schema");
const ProjectDataSource = require("./datasources/ProjectSQLiteDataSource");

const pubsub = new PubSub();

const resolvers = {
  Query: require("./resolvers/query"),
  Mutation: require("./resolvers/mutation"),
  ...require("./resolvers/project"),
  Subscription: require("./resolvers/subscription"),
  Task: require("./resolvers/task")
};

const server = new ApolloServer({
  typeDefs,

  resolvers,

  context: () => ({
    pubsub
  }),

  dataSources: () => ({
    projectDatasource: new ProjectDataSource()
    // TODO: -------------------------------------------------------------------------
    //   - Oben den require-Aufruf für die UserRESTDataSource hinzufügen
    //   - Fuege hier die UserRESTDataSource unter dem Namen 'userDataSource' hinzu
    //
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
