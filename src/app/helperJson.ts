import type { Response } from "express";
 
export type ErrorBody = { error: string };

export function respondWithError(res: Response, code: number, message: string) {
  return respondWithJSON<ErrorBody>(res, code, { error: message });
}

export function respondWithJSON<T>(res: Response, code: number, payload: T) {
  return res.status(code).json(payload); 
}

export function respondNoContent(res: Response) {
  return res.sendStatus(204);
}
