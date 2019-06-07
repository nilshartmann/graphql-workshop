const { ApolloServer } = require("apollo-server");
const schema = require("./schema");
const UserService = require("./domain/users");

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
    }
  }
};

//

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  dataSources: () => {
    return {
      userservice: new UserService()
    };
  }
});

console.log(server);

server.listen().then(({ url }) => {
  console.log(`  Server ready at ${url}`);
});
