import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
const APOLLO_URL = "http://localhost:4000";
export default function createApolloClient() {
  const httpLink = new HttpLink({
    uri: APOLLO_URL
  });

  // const wsLink = new WebSocketLink({
  //   uri: "ws://localhost:8080/subscriptions",
  //   options: {
  //     reconnect: true
  //   }
  // });

  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  // const remoteLink = split(
  //   // split based on operation type
  //   ({ query }) => {
  //     const def = getMainDefinition(query);
  //     return def.kind === "OperationDefinition" && def.operation === "subscription";
  //   },
  //   wsLink,
  //   httpLink
  // );

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) => {
        console.error(`[GraphQL error]: ${message}`);
        console.error(`LOCATIONS: ${JSON.stringify(locations)}`);
        console.error(`PATH: ${JSON.stringify(path)}`);
      });
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  });

  // const authLink = setContext((_, { headers }) => {
  // 	const token = getAuthToken();
  // 	if (token) {
  // 		return {
  // 			headers: {
  // 				...headers,
  // 				authorization: `Bearer ${token}`
  // 			}
  // 		};
  // 	}
  // 	return headers;
  // });

  return new ApolloClient({
    link: ApolloLink.from([errorLink, httpLink]),
    cache: new InMemoryCache()
  });
}