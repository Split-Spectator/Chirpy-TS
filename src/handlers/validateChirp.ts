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

    return respondWithJSON(res, 200, { valid: true });
  } catch {
    return respondWithError(res, 400, "Something went wrong");
  }
}
