import {
  EnvironmentVariable,
  authProviders,
  configureWunderGraphApplication,
  cors,
  introspect,
  templates,
} from "@wundergraph/sdk";
import { NextJsTemplate } from "@wundergraph/nextjs/dist/template";
import server from "./wundergraph.server";
import operations from "./wundergraph.operations";

const federatedApi = introspect.federation({
  apiNamespace: "federated",
  upstreams: [
    {
      url: "http://localhost:4001/graphql",
    },
    {
      url: "http://localhost:4002/graphql",
    },
    {
      url: "http://localhost:4003/graphql",
    },
    {
      url: "http://localhost:4004/graphql",
    },
  ],
});

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
  apis: [federatedApi],
  server: {
    ...server,
    options: {
      listen: {
        port: "8882",
      },
    },
  },
  operations,
  options: {
    listen: {
      port: "8881",
    },
    listenInternal: {
      port: "8883",
    },
  },
  codeGenerators: [
    {
      templates: [...templates.typescript.all],
    },
    {
      templates: [new NextJsTemplate()],
      path: "../../packages/generated-federation",
    },
  ],
  cors: {
    ...cors.allowAll,
    allowedOrigins:
      process.env.NODE_ENV === "production"
        ? [process.env.NEXT_PUBLIC_URL as string]
        : [
            "http://localhost:3001",
            "http://127.0.0.1:3001/",
            new EnvironmentVariable("WG_ALLOWED_ORIGIN"),
          ],
  },
  dotGraphQLConfig: {
    hasDotWunderGraphDirectory: false,
  },
  security: {
    enableGraphQLEndpoint: process.env.NODE_ENV !== "production",
  },
});
