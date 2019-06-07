const { ApolloServer } = require("apollo-server");
const schema = require("./schema");
const UserService = require("./domain/users");

function helloWorld() {
  console.log("HUHU");

  return "Hello, World!";
}

const resolvers = {
  Query: {
    ping: helloWorld,
    users: async () => {}
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

server.listen().then(({ url }) => {
  console.log(`  Server ready at ${url}`);
});
