import type { Response, Request, NextFunction } from "express";


export function  middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
      const code = res.statusCode;
      if (code >= 400)  {
        console.log(`[NON-OK] ${req.method} ${req.url}  - Status: ${res.statusCode} `)
       }
      });
      
    next();
};