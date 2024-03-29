import express, { Request, Response } from 'express';
import { supabase } from "../supabase";
import { filterQuery } from '../utils/filterQuery';
import { cacheMiddleware } from '../utils/cacheMiddleware';
import { getSimilarDoodles } from '../utils/getSimilarDoodles';
import { Doodle } from '../utils/types';

const router = express.Router();

export const fieldsToGet = `id, url, image_text, tags, tumblr_image_url, background_color, created_at, doodle_tag(tag)`;

router.route('/').get(cacheMiddleware(600), async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 20;
    const order = req.query.order;

    if (perPage > 100) {
        res.status(400).send("The maximum page size is 100. Retry with a lower per_page query parameter.");
    }


    const offset = (page - 1) * perPage;
    const rangeEnd = offset + perPage - 1;
    
    const isAscending = order !== "descending";

    try {
        const supabaseQuery = supabase
            .from("positive_doodles")
            .select(fieldsToGet, { count: 'exact' })
            .limit(perPage)
            .range(offset, rangeEnd)
            .order('id', { ascending: isAscending });

        filterQuery(supabaseQuery, req.query);

        const { data, count, error } = await supabaseQuery;

        if (error) {
            return res.status(500).json(error);
        }
        return res.json({
            data: data,
            total_items: count
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.route('/random').get(async (req: Request, res: Response) => {
    try {
        const supabaseQuery = supabase
            .from("random_positive_doodle")
            .select(fieldsToGet)

        filterQuery(supabaseQuery, req.query);

        supabaseQuery
            .limit(1)
            .single();

        const { data, error } = await supabaseQuery;
        if (error) {
            return res.status(500).json(error);
        }
        return res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.route('/tags').get(cacheMiddleware(600), async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.per_page as string) || 40;

    const offset = (page - 1) * perPage;
    const rangeEnd = offset + perPage - 1;

    try {
        const { data, count, error } = await supabase
            .from("tag_count")
            .select('*', { count: 'exact' })
            .limit(perPage)
            .range(offset, rangeEnd);

        if (error) {
            return res.status(500).json(error);
        }
        
        return res.json({
            data: data,
            total_items: count
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});


router.route('/:id').get(cacheMiddleware(600), async (req: Request, res: Response) => {
    const id = req.params.id;

    let similar = parseInt(req.query.similar as string);

    if (similar > 5) similar = 5; // query param has a max of 5

    try {
        let { data, error } = await supabase
            .from("positive_doodles")
            .select(fieldsToGet)
            .eq('id', id)
            .limit(1)
            .single();
        
        if (error) {
            return res.status(500).json(error);
        }

        const dataCopy: Doodle = { ...data };

        if (similar) {
            const similarDoodles: Doodle[] = await getSimilarDoodles(data!, similar);
            dataCopy.similar = similarDoodles;
        }

        return res.json(dataCopy);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

export default router;