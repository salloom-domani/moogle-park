import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

import { getSession } from "./auth";
import { NotFoundError } from "./errors";
import { getUser } from "./services/users";

export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await getSession();

  if (!session) {
    throw new NotFoundError("Session not found!");
  }

  const user = await getUser(session.user.id);

  if (!user) {
    throw new NotFoundError("Session is not valid!");
  }

  return next({ ctx: { user } });
});
