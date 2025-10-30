import {config} from "../config.js"
import type { Response, Request, NextFunction } from "express";
import { respondWithError } from "./helperJson.js";
import { BadRequestError, NotFoundError, UserForbiddenError, UserNotAuthenticatedError, } from "../handlers/errors.js";


export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  res.on("finish", () => {
    const code = res.statusCode;
    if (code)  {
      config.fileserverHits += 1;
     }
    });
    
  next();
};



export function errorMiddleWare(
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction,
) {
  let statusCode = 500;
  let message = "Something went wrong on our end";

  if (err instanceof BadRequestError) {
    statusCode = 400;
    message = err.message;
  } else if (err instanceof UserNotAuthenticatedError) {
    statusCode = 401;
    message = err.message;
  } else if (err instanceof UserForbiddenError) {
    statusCode = 403;
    message = err.message;
  } else if (err instanceof NotFoundError) {
    statusCode = 404;
    message = err.message;
  }

  if (statusCode >= 500) {
    console.log(err.message);
  }

  respondWithError(res, statusCode, message);
}