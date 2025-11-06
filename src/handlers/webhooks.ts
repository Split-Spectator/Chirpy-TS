import type { Request, Response, NextFunction,  } from "express";
import { respondNoContent, respondWithError, } from "../app/helperJson.js";
import { makeRed, GetUserByID} from "../db/queries/users.js";


interface PolkaWebhook {
    event: string;
    data?: { userId?: string };
   }
  
function isPolkaWebhook(x: any): x is PolkaWebhook {
    return x && typeof x.event === "string" && typeof x.data === "object";
  }
export async function handlerMakeRed(req: Request, res: Response) {
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

