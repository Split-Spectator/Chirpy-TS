import { pgTable, timestamp, varchar, uuid, text, boolean} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  hashedPassword: varchar("password").default("unset"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: varchar("email", { length: 256 }).unique().notNull(),
  isChirpyRed: boolean("is_chirpy_red").default(false),
});

export type NewUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const chirps = pgTable("chirps", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  body: text("body").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  });
    
export type NewChirp = typeof chirps.$inferInsert;



export const refresh_tokens = pgTable("refresh_tokens", {
  token: varchar("token", { length: 256 }).primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date()),
  userId: uuid("user_id")
  .notNull()
  .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull().default(sql`now() + interval '60 days'`), // epoch 5184000 if interval doesnt work 
  revokedAt: timestamp("revoked_at"),
});

export type NewRefreshToken = typeof refresh_tokens.$inferInsert;
export type SelectRefreshToken = typeof refresh_tokens.$inferSelect;

