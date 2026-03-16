import { ApolloClient, InMemoryCache, HttpLink, split, } from "@apollo/client";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { closeWsClient, getWsClient } from "./wsClient.ts";

const hostname = "https://announcement2-0.onrender.com";

const httpLink = new HttpLink({
  uri: `https://${hostname}/graphql`,
  credentials: 'include',
});

const wsLink = new GraphQLWsLink(getWsClient());

const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return (
      def.kind === 'OperationDefinition' &&
      def.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});


window.addEventListener('beforeunload', () => {
  closeWsClient();
});

export default client;



