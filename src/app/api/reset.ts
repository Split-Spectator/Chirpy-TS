import {config} from "../../config.js"
import type { Response, Request, NextFunction } from "express";


export function handlerReset(req: Request, res: Response)  {
    config.fileserverHits = 0;
    let count = config.fileserverHits;
    let headers = {
        "Content-Type": "text/plain; charset=utf-8"
    }
    res.set(headers);
    res.status(200).send(`fileserverHits reset back to ${count}`);
    res.end();
}