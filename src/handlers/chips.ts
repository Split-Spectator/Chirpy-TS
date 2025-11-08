import type { Request, Response } from "express";
import { respondWithJSON, respondWithError, respondNoContent } from "../app/helperJson.js";
import { BadRequestError, UserNotAuthenticatedError } from "./errors.js";
import {createChirp, GetAllChirps, GetChirp, DeleteChirp, GetChirpByAuthor} from "../db/queries/chips.js";
import { register } from "module";
import { getBearerToken, validateJWT } from "./auth.js";
import { config } from "../config.js";


export async function handlerValchip(req: Request, res: Response) {
    const { body, userId} = req.body as { body?: string, userId?: string};
    let bear = await getBearerToken(req);
    let ok: string | false = false;
    try { 
       ok = validateJWT(bear, config.api.secret);
    } catch {
      ok = false;
    }

    if (!ok) {
      return respondWithError(res, 401, "JWT not valid")
    }

 
    if (userId && userId !== ok) {
      return respondWithError(res, 401, "UserID does not match session token")
    }
 
    if (typeof body !== "string") {
        throw new BadRequestError("Invalid payload");
    }

    if (body.length > 140) {
      throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    const badWords =  ["fornax", "sharbert", "kerfuffle"];
    
    let words = body.split(" ");
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const loweredWord = word.toLowerCase();
      if (badWords.includes(loweredWord)) {
        words[i] = "****";
      }
    }
    const CleanBody = words.join(" ");
    const chirp = await createChirp({ body: CleanBody, userId: ok });
            if (!chirp) {
               return respondWithError(res, 500, "Failed to create chirp");
            }
   return respondWithJSON(res, 201,{
      id: chirp.id,
      createdAt: chirp.createdAt,
      updatedAt: chirp.updatedAt,
      body: chirp.body,
      userId: ok,
    });
  }  
 
  export async function handlerGetChirps(req: Request, res: Response) {
    const q = req.query.authorId;
    const s = req.query.sort;
    const authorId = typeof q === "string" ? q : "";
    const sort = typeof s === "string" ? s : "";

    const rows = authorId
    ? await GetChirpByAuthor(authorId)
    : await GetAllChirps();
  
  if (sort === "desc") {
    rows.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } 
  return respondWithJSON(res, 200, rows);
}

export async function GetChirpOne(req: Request, res: Response){
    const { chirpID } = req.params;
    const chirp = await GetChirp(chirpID);
    if (!chirp) {
        return res.status(404).json({ error: "Chirp not found" });
    }
    return res.status(200).json(chirp);
}


export async function DeleteChirpRequest(req: Request, res: Response){
  let bear = await getBearerToken(req);
  let ok: string | false = false;
  try { 
     ok = validateJWT(bear, config.api.secret);
  } catch {
    ok = false;
  }
  if (!ok) {
    return respondWithError(res, 401, "JWT not valid");
  }

const { chirpID } = req.params;
const chirp = await GetChirp(chirpID);
if (!chirp) {
    return res.status(404).json({ error: "Chirp not found" });
}

if (chirp.userId !== ok) {
  return respondWithError(res, 403, "Not authorized");
}
try { 
await DeleteChirp(chirp.id);
} catch {
  respondWithError(res, 500, "Deleting Chrip Failed");
}
return respondNoContent(res);
};

 