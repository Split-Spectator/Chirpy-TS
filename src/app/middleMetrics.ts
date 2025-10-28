import {config} from "../config.js"
import type { Response, Request, NextFunction } from "express";


export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  res.on("finish", () => {
    const code = res.statusCode;
    if (code)  {
      config.fileserverHits += 1;
     }
    });
    
  next();
};

  