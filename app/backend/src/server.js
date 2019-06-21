const { ApolloServer, PubSub } = require("apollo-server");
const responseCachePlugin = require("apollo-server-plugin-response-cache");

const typeDefs = require("./schema");
const UserRESTDataSource = require("./datasources/UserRESTDataSource");
// const ProjectDataSource = require("./datasources/ProjectPGDataSource");
const ProjectDataSource = require("./datasources/ProjectSQLiteDataSource");

const pubsub = new PubSub();

const resolvers = {
  Query: require("./resolvers/query"),
  Mutation: require("./resolvers/mutation"),
  Subscription: require("./resolvers/subscription"),
  Project: require("./resolvers/project"),
  Task: require("./resolvers/task")
};

const buildDataSources = () => ({
  projectDatasource: new ProjectDataSource(),
  userDataSource: new UserRESTDataSource()
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

  plugins: [responseCachePlugin()],

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
