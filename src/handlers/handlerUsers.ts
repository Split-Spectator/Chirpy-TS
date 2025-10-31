import type { Request, Response, NextFunction,  } from "express";
import { respondWithJSON, respondWithError } from "../app/helperJson.js";
import { BadRequestError } from "./errors.js";
import {createUser} from "../db/queries/users.js";

export async function handlerUsers(req: Request, res: Response) {
        const { email } = req.body;
        if (!email || typeof email !== "string") {
           return respondWithError(res, 400, "Invalid email" );
        }
        const user = await createUser({ email });
        if (!user) {
           return respondWithError(res, 500, "Failed to create user");
        }
        return respondWithJSON(res, 201, user);    
}