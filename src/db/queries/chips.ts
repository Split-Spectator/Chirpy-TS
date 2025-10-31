import { db } from "../index.js";
import {  chirps, NewChirp} from "../schema.js";
import { randomUUID } from "crypto";


export async function createChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .returning();
  return result;
}

