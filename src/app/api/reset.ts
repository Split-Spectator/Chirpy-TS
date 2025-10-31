import {config} from "../../config.js"
import type { Response, Request, NextFunction } from "express";
import { deleteUsers } from "../../db/queries/users.js";


export async function handlerReset(req: Request, res: Response)  {
        if (config.db.platform !== "dev") {
            return res.status(403).json({ error: "Forbidden" });
        }
        await deleteUsers();
        return res.status(200).json({ message: "All users deleted" });
}