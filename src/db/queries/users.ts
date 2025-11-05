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

async function getUserBy<K extends "id" | "email">(key: K, value: string) {
  const col = key === "id" ? users.id : users.email;
  const [row] = await db.select().from(users).where(eq(col, value));
  return row ?? null;
}

export const GetUser = (email: string) => getUserBy("email", email);
export const GetUserByID = (id: string) => getUserBy("id", id);


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

