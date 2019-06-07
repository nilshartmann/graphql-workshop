import { ApolloServer, gql, IResolvers } from "apollo-server";

import schema from "./schema";
import UserService from "./domain/users";

function helloWorld() {
  console.log("HUHU");

  return "Hello, World!";
}

const resolvers: IResolvers<{}, {}> = {
  Query: {
    ping: helloWorld,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    users: async (_f, _x, context: any) => {}
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
