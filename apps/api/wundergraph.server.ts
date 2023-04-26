import { configureWunderGraphServer } from "@wundergraph/sdk/server";
import type { HooksConfig } from "./generated/wundergraph.hooks";
import type { InternalClient } from "./generated/wundergraph.internal.client";

export default configureWunderGraphServer<HooksConfig, InternalClient>(() => ({
  hooks: {
    queries: {},
    mutations: {},
    authentication: {
      mutatingPostAuthentication: async ({ internalClient, user, log }) => {
        if (!user || !user.name || !user.email || !user.userId) {
          log.error("User not found or incomplete");
          return {
            user: user,
            status: "deny",
            message: "User not found or incomplete",
          };
        }
        log.info(`User authenticated: ${user.email}`);
        const result = await internalClient.mutations.InternalUser({
          input: {
            email: user.email,
            name: user.name,
            id: user.userId,
            picture: user.picture,
          },
        });
        if (result.errors || !result.data) {
          log.error(`Error upserting user: ${result.errors}`);
          return {
            user: user,
            status: "deny",
            message: "Error upserting user",
          };
        }
        if (result.data) {
          log.info(`User upserted: ${result.data.db_upsertOneUser?.id}`);
        }
        return {
          user: {
            ...user,
            customClaims: {
              createdAt: result.data?.db_upsertOneUser?.createdAt,
            },
          },
          status: "ok",
        };
      },
    },
  },
}));
