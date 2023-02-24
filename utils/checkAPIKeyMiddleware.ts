import { Request, Response, NextFunction } from "express";
import { supabase } from "../supabase";

export const checkAPIKeyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const key = req.query.key || req.headers['x-api-key'];

    if (!key) {
        return res.status(401).json({ error: 'Unauthorized, no API key.' });
    }

    try {
        const { data, error } = await supabase
            .from("api_keys")
            .select()
            .eq('key', key);

        if (error || !data || (data && data.length === 0)) {
            return res.status(401).json({ error: 'Unauthorized, incorrect API key.' });
        }
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: 'Unauthorized, error verifying API key.' });
    }
};