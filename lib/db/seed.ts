import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "./schema";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const user: typeof users.$inferInsert = {
    name: "John",
    email: "john@example.com",
  };

  await db.insert(users).values(user);
  console.log("New user created!");
}

main();
