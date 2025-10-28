import {config} from "../../config.js"
import type { Response, Request, NextFunction } from "express";


export function handlerMetrics(req: Request, res: Response, next: NextFunction)  {
    let count = config.fileserverHits;
    let headers = {
        "Content-Type": "text/plain; charset=utf-8"
    }
    res.set(headers);
    res.status(200).send(`Hits: ${count}`);
    res.end();
}