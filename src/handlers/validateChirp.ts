import type { Request, Response } from "express";
import { respondWithJSON, respondWithError } from "../app/helperJson.js";

export function handlerValchip(req: Request, res: Response) {
  try {
    const { body } = req.body as { body?: string };

    if (typeof body !== "string") {
      return respondWithError(res, 400, "Invalid payload");
    }

    if (body.length > 140) {
      return respondWithError(res, 400, "Chirp is too long");
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
    const cleaned = words.join(" ");

    return respondWithJSON(res, 200, { cleaned });
  } catch {
    return respondWithError(res, 400, "Something went wrong");
  }
}
