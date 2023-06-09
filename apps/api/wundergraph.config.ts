import {
  configureWunderGraphApplication,
  cors,
  EnvironmentVariable,
  introspect,
  templates,
  authProviders,
} from "@wundergraph/sdk";
import { NextJsTemplate } from "@wundergraph/nextjs/dist/template";
import server from "./wundergraph.server";
import operations from "./wundergraph.operations";

const db = introspect.postgresql({
  apiNamespace: "db",
  databaseURL: new EnvironmentVariable("NEON_DATABASE_URL"),
  introspection: {
    pollingIntervalSeconds: 5,
  },
  requestTimeoutSeconds: 60,
});

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
  apis: [db],
  server,
  operations,
  codeGenerators: [
    {
      templates: [
        // use all the typescript react templates to generate a client
        ...templates.typescript.all,
        templates.typescript.operations,
        templates.typescript.linkBuilder,
      ],
    },
    {
      templates: [new NextJsTemplate()],
      path: "../../packages/generated-wundergraph",
    },
  ],
  cors: {
    ...cors.allowAll,
    allowedOrigins:
      process.env.NODE_ENV === "production"
        ? ["https://speedtest.wundergraph.app"]
        : [
            "http://localhost:3000",
            "http://127.0.0.1:3000/",
            new EnvironmentVariable("WG_ALLOWED_ORIGIN"),
          ],
  },
  authentication: {
    cookieBased: {
      providers: [
        authProviders.google({
          id: "google",
          clientId: new EnvironmentVariable("GOOGLE_CLIENT_ID", ""),
          clientSecret: new EnvironmentVariable("GOOGLE_CLIENT_SECRET", ""),
        }),
      ],
      authorizedRedirectUris:
        process.env.NODE_ENV === "production"
          ? ["https://speedtest.wundergraph.app"]
          : ["http://localhost:3000"],
    },
  },
  dotGraphQLConfig: {
    hasDotWunderGraphDirectory: false,
  },
  security: {
    enableGraphQLEndpoint: process.env.NODE_ENV !== "production",
  },
});
