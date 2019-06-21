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

const buildDataSources = () => ({
  projectDatasource: new ProjectDataSource()
  // TODO: -------------------------------------------------------------------------
  //   - Oben den require-Aufruf für die UserRESTDataSource hinzufügen
  //   - Fuege hier die UserRESTDataSource unter dem Namen 'userDataSource' hinzu
  //
});

const dataSourcesForSubscription = connection => {
  // In WebSocket Requests for Subscription,
  // the DataSources are not set :-(
  // So we have to workaround here and initialize and set them manually
  // see: https://github.com/apollographql/apollo-server/issues/1526#issuecomment-503285841

  const dataSources = buildDataSources();
  Object.values(dataSources)
    .filter(ds => typeof ds.initialize === "function")
    .forEach(ds =>
      ds.initialize({ context: connection.context, cache: undefined })
    );

  return dataSources;
};

const buildContext = ({ _req, connection }) =>
  connection
    ? {
        dataSources: dataSourcesForSubscription(connection),
        pubsub
      }
    : { pubsub };

const server = new ApolloServer({
  typeDefs,

  resolvers,

  context: buildContext,

  dataSources: buildDataSources,

  formatError: err => {
    console.error(err.originalError || err);
    return err;
  },

  playground: {
    // Playground runs at http://localhost:4000
    settings: {
      "editor.theme": "light",
      "schema.polling.enable": true
    }
  }
});

server.listen().then(({ url }) => {
  console.log(`  Server ready at ${url}`);
});
