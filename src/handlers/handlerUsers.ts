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
  let { email, password } = req.body as { email: string; password: string; };
      let bear = await getBearerToken(req);
      let ok: string | false = false;
      try { 
        ok = validateJWT(bear, config.api.secret);
      } catch {
        ok = false;
      }
      if (!ok) {
        return respondWithError(res, 401, "Invalid JWT")
      }
  const userByID = await GetUserByID(ok);
   if (!userByID) {
     return respondWithError(res, 401, "Unable to verify user");
   }

   const hashedPassword = await hashPassword(password);

   const userInfo = {
    id: userByID.id,
    email: email,
    hashedPassword: hashedPassword,
    createdAt: userByID.createdAt,
    updatedAt: userByID.updatedAt,
   }

   try {
    await resetPasswordQuery(userInfo);
   } catch {
    return respondWithError(res, 500, "Failed to update password / email")
   }

   const user = await GetUserByID(userByID.id);
   if (!user) {
     return respondWithError(res, 401, "Unable to verify user");
   }

   return respondWithJSON(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });

 }