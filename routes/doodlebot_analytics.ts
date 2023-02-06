import express, { Request, Response } from 'express';
import { supabase } from "../supabase";

const router = express.Router();

router.route('/').get(async (req: Request, res: Response) => {
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
        console.error(error);
        return res.status(500).json(error);
    }

    return res.json({
        data,
        total_items: count
    });
});

export default router;