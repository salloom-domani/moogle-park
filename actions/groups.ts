"use server";

import { authActionClient } from "@/lib/safe-action";
import { createGroupSchema } from "@/lib/schemas";
import { createGroup } from "@/lib/services/groups";

export const createGroupAction = authActionClient
  .metadata({ actionName: "createGroup" })
  .schema(createGroupSchema)
  .action(async ({ parsedInput: { name }, ctx }) => {
    const group = await createGroup(name, ctx.user.id);
    return { ok: true, message: "Group created", data: group };
  });
