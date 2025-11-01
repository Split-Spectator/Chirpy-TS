import type { Request, Response, NextFunction,  } from "express";
import { respondWithJSON, respondWithError } from "../app/helperJson.js";
import { BadRequestError } from "./errors.js";
import {createUser, GetUser} from "../db/queries/users.js";
import {hashPassword, checkPasswordHash } from "./auth.js";
import { NewUser } from "src/db/schema.js";

 
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
   const { email, password } = req.body as { email?: string; password?: string };
 
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
 
   return respondWithJSON(res, 200, {
     id: user.id,
     email: user.email,
     createdAt: user.createdAt,
     updatedAt: user.updatedAt,
   });
 }
 