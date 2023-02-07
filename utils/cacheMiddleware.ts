import { Request, Response, NextFunction } from "express";
import cache from "memory-cache";

export const cacheMiddleware = (duration: number) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const key = `__cache__${req.originalUrl}` || req.url;
        const cachedBody = cache.get(key);

        if (cachedBody) {
            return res.send(cachedBody);
        } else {
            (res as any).sendResponse = res.send;
            res.send = (body) => {
                cache.put(key, body, duration * 1000);
                return (res as any).sendResponse(body);
            };
            next();
        }
    };
};