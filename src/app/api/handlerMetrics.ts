import {config} from "../../config.js"
import type { Response, Request, NextFunction } from "express";

  
    export const handlerMetrics = (req: Request, res: Response) => {
        const hits = config.api.fileserverhits
        const html = `
            <html>
            <body>
              <h1>Welcome, Chirpy Admin</h1>
              <p>Chirpy has been visited ${hits} times!</p>
            </body>
          </html>
        `;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.status(200).send(html);
      };