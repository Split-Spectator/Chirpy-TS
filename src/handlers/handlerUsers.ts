import type { Request, Response, NextFunction,  } from "express";
import { respondWithJSON, respondWithError } from "../app/helperJson.js";
import { BadRequestError } from "./errors.js";
import {createUser, GetUser, addRefreshToken, GetUserByID, resetPasswordQuery} from "../db/queries/users.js";
import {hashPassword, checkPasswordHash, makeJWT, makeRefreshToken } from "./auth.js";
import { NewUser } from "../db/schema.js";
import { getBearerToken, validateJWT } from "./auth.js";
import { config } from "../config.js";


 
export async function handlerUsers(req: Request, res: Response) {
   const { email, password } = req.body as { email?: string; password?: string };

   if (typeof email !== "string") {
     return respondWithError(res, 400, "Invalid email");
   }
   if (typeof password !== "string") {
     return respondWithError(res, 400, "Invalid password type");
   }

   const hashedPassword = await hashPassword(password);
   
   const user = await createUser({ email: email, hashedPassword });
      if (!user) {
         return respondWithError(res, 500, "Failed to create user");
      }

   return respondWithJSON(res, 201, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}

 
 

export async function handlerLogin(req: Request, res: Response) {
   let { email, password } = req.body as { email?: string; password?: string; };
 
   if (typeof email !== "string") {
     return respondWithError(res, 400, "Invalid email");
   }
   if (typeof password !== "string") {
     return respondWithError(res, 400, "Invalid password type");
   }
 
   const user = await GetUser(email);
   if (!user) {
     return respondWithError(res, 401, "Incorrect email or password");
   }
 
   const hash = user.hashedPassword //?? null;
   if (!hash || hash === "unset") {
     return respondWithError(res, 401, "Incorrect email or password");
   }
 
   const ok = await checkPasswordHash(password, hash);
   if (!ok) {
     return respondWithError(res, 401, "Incorrect email or password");
   }

   const jwtToken = makeJWT(user.id,  config.api.secret);
   const refreshToken = makeRefreshToken();
   await addRefreshToken({ userId: user.id, token: refreshToken,})

   return respondWithJSON(res, 200, {
     id: user.id,
     email: user.email,
     createdAt: user.createdAt,
     updatedAt: user.updatedAt,
     token: jwtToken,
     refreshToken: refreshToken,
   });
 }
 



 export async function resetPassword(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };

  const bearer = await getBearerToken(req);
  let userId: string;
  try {
    userId = validateJWT(bearer, config.api.secret);
  } catch {
    return respondWithError(res, 401, "Invalid JWT");
  }

  const user = await GetUserByID(userId);
  if (!user) return respondWithError(res, 401, "Unable to verify user");

  const hashedPassword = await hashPassword(password);

  try {
    await resetPasswordQuery({
      id: user.id,
      email,
      hashedPassword,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch {
    return respondWithError(res, 500, "Failed to update password / email");
  }
  const updated = await GetUserByID(user.id);
  if (!updated) return respondWithError(res, 500, "User not found after update");

  return respondWithJSON(res, 200, {
    id: updated.id,
    email: updated.email,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  });
}