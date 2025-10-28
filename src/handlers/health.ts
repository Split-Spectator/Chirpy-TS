import type { Response, Request, NextFunction } from "express";

export function handlerReadiness(req: Request, res: Response) {
    let headers = {
        "Content-Type": "text/plain; charset=utf-8"
    }
    res.set(headers);
    res.send("OK");
    res.end();
};
