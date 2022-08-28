import { Request, Response, NextFunction } from "express";
import { AbstractException, DuplicateException, NotNullException, UnhandledException } from "../exception";

export function exceptionMiddleware(e: Error, req: Request, res: Response, next: NextFunction): unknown {
    try {
        if (!(e instanceof AbstractException)) return res.status(500).send(new UnhandledException(e).toJSON())

        if (e instanceof NotNullException) return res.status(404).send(e.toJSON());

        if (e instanceof DuplicateException) return res.status(400).send(e.toJSON());

        return res.status(500).send(e.toJSON());
    } finally {
        next(e);
    }
}