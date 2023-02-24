import express, { Request, Response } from 'express';
import { supabase } from "../supabase";
import { cacheMiddleware } from '../utils/cacheMiddleware';

const router = express.Router();

router.route('/').get(cacheMiddleware(600), async (req: Request, res: Response) => {
    const { start, end } = req.query;

    const supabaseQuery = supabase
        .from("doodlebot_analytics")
        .select('*', { count: 'exact' })
        .limit(100)
        .order('id', { ascending: false });

    if (start) {
        supabaseQuery.gt('date', start);
    }

    if (end) {
        supabaseQuery.lt('date', end);
    }

    const { data, count, error } = await supabaseQuery;

    if (error) {
        return res.status(500).json(error);
    }

    return res.json({
        data,
        total_items: count
    });
});

router.route('/').post(async (req: Request, res: Response) => {
    const { message_count, commands, args, server_count } = req.body;

    if (!message_count || !commands || !args || !server_count) {
        return res.status(400).json({
            error: "Error adding doodlebot analytics: missing argument(s)"
        });
    }

    const date = new Date();

    try {
        await supabase.from("doodlebot_analytics").insert({
            date,
            message_count,
            commands,
            args,
            server_count
        });

    } catch (err) {
        console.error(`Error inserting analytics: ${err}`);
        return res.status(500).json(err);
    }
});

export default router;