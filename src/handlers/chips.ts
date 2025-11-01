import type { Request, Response } from "express";
import { respondWithJSON, respondWithError } from "../app/helperJson.js";
import { BadRequestError } from "./errors.js";
import {createChirp, GetChirps} from "../db/queries/chips.js";

export async function handlerValchip(req: Request, res: Response) {
 
    const { body, userId} = req.body as { body?: string, userId?: string};
  
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Missing userId" });
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
    const chirp = await createChirp({ body: CleanBody, userId: userId });
            if (!chirp) {
               return respondWithError(res, 500, "Failed to create chirp");
            }


    return respondWithJSON(res, 201, { chirp });
  }  
 
 
 
export async function handlerGetChirps(req: Request, res: Response){
  const chirps = await GetChirps();
        if (chirps.length === 0) {
          return respondWithJSON(res, 200, { chirps: []});
        }
    return respondWithJSON(res, 200, { chirps });
}