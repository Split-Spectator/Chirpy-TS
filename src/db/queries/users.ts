import { db } from "../index.js";
import { NewUser, SelectUser, users, NewRefreshToken, SelectRefreshToken, refresh_tokens } from "../schema.js";
import {  eq, sql   } from "drizzle-orm";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}
export async function deleteUsers() {
  await db.delete(users);
}

export const GetUser = async (email: string) => {
  const [row] = await db.select().from(users).where(eq(users.email, email));
  if (!row)
      return null;
  return row
};
export const GetUserByID = async (id: string) => {
  const [row] = await db.select().from(users).where(eq(users.id, id));
  if (!row)
      return null;
  return row
};


export async function addRefreshToken(refresh_token: NewRefreshToken) {
  const [result] = await db
    .insert(refresh_tokens)
    .values(refresh_token)
    .returning();
  return result;
}


export const GetRefreshToken  = async (
  key: keyof Pick<NewRefreshToken, "token" | "userId">,
  value: string
): Promise<SelectRefreshToken | undefined> => { 
  return await db.query.refresh_tokens.findFirst({
    where: eq(refresh_tokens[key], value),
  });
};


export const revokeToken = async (token: string) => {
  await db.update(refresh_tokens)
  .set({ 
    updatedAt: sql`NOW()` ,
    revokedAt: sql`NOW()` ,
  })
  .where(eq(refresh_tokens.token, token));
}


export const resetPasswordQuery = async (userInfo: SelectUser) => {
    await db.update(users)
    .set({ 
      updatedAt: sql`NOW()` ,
      hashedPassword: userInfo.hashedPassword,
      email: userInfo.email, 
    })
    .where(eq(users.id, userInfo.id));
}

