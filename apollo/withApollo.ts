import { NextPageContext } from "next";
import { setContext } from "@apollo/client/link/context";
import { createWithApollo } from "./createWithApollo";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const httpLink = new HttpLink({
  uri: "http://localhost:8080/graphql",
  credentials: "include",
  fetch,
});

const createClient = (ctx: NextPageContext) =>
  new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.map(({ message, locations, path }) => {
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            );
          });
        if (networkError) console.log(`[Network error]: ${networkError}`);
      }),
      setContext((_, { headers }) => {
        return {
          headers: {
            cookie:
              (typeof window === "undefined"
                ? ctx?.req?.headers.cookie
                : undefined) || "",
          },
        };
      }),
      httpLink,
    ]),
    ssrMode: typeof window === "undefined",
    cache: new InMemoryCache({
      typePolicies: {
        Supplier: {
          fields: {
            entry: {
              merge(existing = [], incoming) {
                return [...incoming];
              },
            },
          },
        },
      },
    }),
  });

export const withApollo = createWithApollo(createClient);
