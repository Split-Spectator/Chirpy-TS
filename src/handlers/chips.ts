import type { Request, Response } from "express";
import { respondWithJSON, respondWithError } from "../app/helperJson.js";
import { BadRequestError } from "./errors.js";
import {createChirp, GetAllChirps, GetChirp} from "../db/queries/chips.js";
import { register } from "module";

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
   return respondWithJSON(res, 201,{
      id: chirp.id,
      createdAt: chirp.createdAt,
      updatedAt: chirp.updatedAt,
      body: chirp.body,
      userId: chirp.userId,
    });
  }  
 
 
 
export async function handlerGetAllChirps(req: Request, res: Response){
  const chirps = await GetAllChirps();
        if (chirps.length === 0) {
          return respondWithJSON(res, 200, { chirps: []});
        }
    return respondWithJSON(res, 200, chirps );
}

export async function GetChirpOne(req: Request, res: Response){
    const { chirpID } = req.params;
    const chirp = await GetChirp(chirpID);
    if (!chirp) {
        return res.status(404).json({ error: "Chirp not found" });
    }
    return res.status(200).json(chirp);
}

