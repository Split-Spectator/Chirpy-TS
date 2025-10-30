import type { Request, Response } from "express";
import { respondWithJSON, respondWithError } from "../app/helperJson.js";
import { BadRequestError } from "./errors.js";

export function handlerValchip(req: Request, res: Response) {
 
    const { body } = req.body as { body?: string };

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
    const cleanedBody = words.join(" ");

    return respondWithJSON(res, 200, { cleanedBody });
  }  
 
 
