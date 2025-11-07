import { db } from "../index.js";
import {  chirps, NewChirp} from "../schema.js";
import { randomUUID } from "crypto";
import { asc, eq  } from "drizzle-orm";


export async function createChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .returning();
  return result;
}

export const GetAllChirps = async () => {
  const rows = await db.select().from(chirps).orderBy(asc(chirps.createdAt));
  return rows
};


export const GetChirp = async (chirpID: string) => {
  const [row] = await db.select().from(chirps).where(eq(chirps.id, chirpID));
  if (!row)
      return null;
  return row
};

export const GetChirpByAuthor = async (AuthorID: string) => {
  const rows = await db.select().from(chirps).where(eq(chirps.userId, AuthorID));
  if (!rows)
      return null;
  return rows
};


export async function DeleteChirp(chirpID: string)  {
  await db.delete(chirps).where(eq(chirps.id, chirpID));
};