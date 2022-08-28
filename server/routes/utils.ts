import { Response, Request, NextFunction } from "express";

export function handleRoute(cb: (req: Request, res: Response) => unknown) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await cb(req, res);
        } catch (e) {
            next(e);
        }
    }
}