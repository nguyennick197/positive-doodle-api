const { supabase } = require("../supabase.js");
const express = require('express');

const router = express.Router();

const fieldsToGet = `id, url, created_at, tags, image_text`

router.route('/').get(async (req, res) => {
    const page = req.query.page || 1;
    const perPage = req.query.per_page || 20;
    const search = req.query.search;

    if (perPage > 100) {
        res.status(400).send("The maximum page size is 100. Retry with a lower per_page query parameter.");
    }

    const offset = (page - 1) * perPage;
    const rangeEnd = offset + perPage - 1;

    try {
        const supabaseQuery = supabase
            .from("positive_doodles")
            .select(fieldsToGet)
            .limit(perPage)
            .range(offset, rangeEnd)
            .order('id', { ascending: true });

        if (search) {
            let searchString = search.toLowerCase().split(" ").join(" | ");
            supabaseQuery.textSearch('doodles_fts', searchString)
        }

        const { data, error } = await supabaseQuery;

        if (error) {
            console.error(error);
            return res.status(500).json(error);
        }
        return res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.route('/random').get(async (req, res) => {
    const category = req.query.category;

    try {
        const supabaseQuery = supabase
            .from("random_positive_doodle")
            .select()
            .limit(1)
            .single();

        if (category) {
            let searchString = category.toLowerCase().split(" ").join(" | ");
            supabaseQuery.textSearch('doodles_fts', searchString)
        }

        const { data, error } = await supabaseQuery;
        if (error) {
            console.error(error);
            return res.status(500).json(error);
        }
        return res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.route('/categories').get(async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("categories")
            .select(fieldsToGet);
        if (error) {
            console.error(error);
            return res.status(500).json(error);
        }
        return res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.route('/tags').get(async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("tag_count")
            .select(fieldsToGet);
        if (error) {
            console.error(error);
            return res.status(500).json(error);
        }
        return res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});


router.route('/:id').get(async (req, res) => {
    const id = req.params.id;

    try {
        const { data, error } = await supabase
            .from("positive_doodles")
            .select(fieldsToGet)
            .eq('id', id)
            .limit(1)
            .single();

        if (error) {
            console.error(error);
            return res.status(500).json(error);
        }
        return res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;