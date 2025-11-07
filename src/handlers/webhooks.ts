import type { Request, Response, NextFunction,  } from "express";
import { respondNoContent, respondWithError, } from "../app/helperJson.js";
import { makeRed, GetUserByID} from "../db/queries/users.js";
import {config } from "../config.js"
import { getApiKey } from "./auth.js";


interface PolkaWebhook {
    event: string;
    data?: { userId?: string };
   }
  
function isPolkaWebhook(x: any): x is PolkaWebhook {
    return x && typeof x.event === "string" && typeof x.data === "object";
  }
export async function handlerMakeRed(req: Request, res: Response) {
  const key = await getApiKey(req);
  if (key !== config.api.polka) return respondWithError(res,401,"Api Key does not match")

    const body = req.body as unknown;
  
    if (!isPolkaWebhook(body)) {
        return respondNoContent(res);
    }; 
  
    if (body.event !== "user.upgraded") {
        return respondNoContent(res);
    }
  
    const userId = body.data?.userId;
    if (!userId) { 
        return res.sendStatus(204); 
    }
      const user = await GetUserByID(userId);
      if (!user) {
        return respondWithError(res, 404, "Unable to find user");
      }
    await makeRed(user.id);
    return respondNoContent(res);
}

