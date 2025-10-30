import { NextPageContext } from "next";
import { setContext } from "@apollo/client/link/context";
import { createWithApollo } from "./createWithApollo";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  Observable,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const httpLink = new HttpLink({
  uri: "https://gqlcustoms-production.up.railway.app/graphql",
  credentials: "include",
  fetch,
});

const AUTH_REDIRECT_EVENT = "authRedirect";

const createClient = (ctx: NextPageContext) => {
  const errorLink = onError(
    ({ graphQLErrors, networkError, operation, forward }) => {
      if (graphQLErrors) {
        for (let err of graphQLErrors) {
          if (err.message === "not authenticated") {
            return new Observable((observer) => {
              if (typeof window !== "undefined") {
                const currentUrl = new URL(window.location.href);
                const loginUrl = new URL("/", currentUrl.origin);
                loginUrl.searchParams.set(
                  "redirect",
                  currentUrl.pathname + currentUrl.search
                );

                const event = new CustomEvent(AUTH_REDIRECT_EVENT, {
                  detail: { url: loginUrl.toString() },
                });
                window.dispatchEvent(event);
              } else {
                if (ctx.res) {
                  ctx.res.writeHead(302, { Location: "/" });
                  ctx.res.end();
                }
              }

              observer.complete();
            });
          }
        }
      }
      if (networkError) console.log(`[Network error]: ${networkError}`);

      return forward(operation);
    }
  );

  return new ApolloClient({
    link: ApolloLink.from([
      errorLink,
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
};

export const withApollo = createWithApollo(createClient);
