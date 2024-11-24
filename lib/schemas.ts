import { z } from "zod";

export const createGroupSchema = z.object({
  name: z.string(),
});
