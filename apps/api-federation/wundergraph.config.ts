import {
  EnvironmentVariable,
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
      url: "https://wg-federation-demo-accounts.fly.dev/graphql",
    },
    {
      url: "https://wg-federation-demo-products.fly.dev/graphql",
    },
    {
      url: "https://wg-federation-demo-reviews.fly.dev/graphql",
    },
    {
      url: "https://wg-federation-demo-inventory.fly.dev/graphql",
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
        ? ["https://apollo-federation-cloud-demo.vercel.app"]
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
