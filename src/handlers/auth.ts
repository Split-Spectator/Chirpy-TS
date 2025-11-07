import * as argon2 from "argon2";
import { JsonWebTokenError } from "jsonwebtoken";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config, getEnv } from "../config.js";  
import type { Request, Response, NextFunction,   } from "express";
import { UserNotAuthenticatedError } from "./errors.js";
import { GetRefreshToken } from "../db/queries/users.js";
import { respondWithJSON, respondWithError, respondNoContent } from "../app/helperJson.js";
import { revokeToken } from "../db/queries/users.js";
import { randomBytes } from 'node:crypto';
 

export async function hashPassword(password: string): Promise<string> {
try {
  const hash = await argon2.hash(password);
  return hash;
} catch (err) { 
   throw new Error("Hashing password failed");
}
};

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    try {
        if (await argon2.verify(hash, password)) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        throw new Error("Checking password failed")  
      }
}


export function makeJWT(userID: string,  secret: string): string {
  const iat = Math.floor(Date.now() / 1000);
  const expiresIn = 3600;
  const payload = { iss: "chirpy", sub: userID, iat, exp: iat + expiresIn };
  return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string): string {
  const decoded = jwt.verify(tokenString, secret) as JwtPayload;
    if (!decoded.sub) throw new Error("invalid token");
  return decoded.sub;
}

export const getBearerToken = (req: Request) => {
  const rawToken = req.get("Authorization");
    if (rawToken === undefined) {
      throw new UserNotAuthenticatedError("Invalid JWT");
    }
  const splitToken = rawToken.split(" ");
    if (splitToken.length < 2 || splitToken[0] !== "Bearer") {
      throw new UserNotAuthenticatedError("Invalid JWT");
    }
  return splitToken[1];
};


export function makeRefreshToken(): string {
  const buf = randomBytes(32);
  return buf.toString('hex');
}

export const refreshToken = async (req: Request, res: Response) => {
  const bear = await getBearerToken(req);
  const valid = await GetRefreshToken("token", bear);
  if  (!valid) {
    return respondWithError(res, 401, "token not valid");
  }
  const now = Date.now();
  if (now > Number(valid.expiresAt) || valid.revokedAt) {
    return respondWithError(res, 401, "token expired");
  }
  const userID = valid.userId
  const jwtToken = makeJWT(userID, config.api.secret);
return respondWithJSON(res, 200, { token: jwtToken })
}


export const revokeRefreshToken = async (req: Request, res: Response) => {
  const bear = await getBearerToken(req);
  await revokeToken(bear);
  return respondNoContent(res);
}

export const getApiKey = (req: Request) => {
  const rawReq = req.headers.authorization;
    if (rawReq === undefined) {
      throw new UserNotAuthenticatedError("Missing Auth Header");
    }
  const splitToken = rawReq.split(" ");
    if (splitToken.length < 2 || splitToken[0] !== "ApiKey") {
      throw new UserNotAuthenticatedError("Api Key malformed request");
    }
  return splitToken[1];
};

