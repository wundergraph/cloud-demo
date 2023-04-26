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
        ? ["https://speedtest-cloud-demo.vercel.app"]
        : [
            "http://localhost:3000",
            "http://127.0.0.1:3000/",
            new EnvironmentVariable("WG_ALLOWED_ORIGIN"),
          ],
  },
  authentication: {
    cookieBased: {
      secureCookieBlockKey: new EnvironmentVariable("SECURE_COOKIE_BLOCK_KEY"),
      secureCookieHashKey: new EnvironmentVariable("SECURE_COOKIE_HASH_KEY"),
      csrfTokenSecret: new EnvironmentVariable("CSRF_TOKEN_SECRET"),
      providers: [
        authProviders.google({
          id: "google",
          clientId: new EnvironmentVariable("GOOGLE_CLIENT_ID", ""),
          clientSecret: new EnvironmentVariable("GOOGLE_CLIENT_SECRET", ""),
        }),
      ],
      authorizedRedirectUris:
        process.env.NODE_ENV === "production"
          ? ["https://speedtest-cloud-demo.vercel.app"]
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
