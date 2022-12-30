const { supabase } = require("../supabase.js");
const { doesCategoryExist } = require('../utils/categories');
const express = require('express');

const router = express.Router();

router.route('/').get(async (req, res) => {
    const page = req.query.page || 1;
    const perPage = req.query.per_page || 20;

    if (perPage > 100) {
        res.status(400).send("The maximum page size is 100. Retry with a lower per_page query parameter.");
    }

    const offset = (page - 1) * perPage;
    const rangeEnd = offset + perPage - 1;

    try {
        const { data, error } = await supabase
            .from("doodles")
            .select()
            .limit(perPage)
            .range(offset, rangeEnd)
            .order('url', { ascending: false });

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
            .from("random_doodle")
            .select()
            .limit(1)
            .single();
        if (category) {
            const categoryExists = doesCategoryExist(category)
            if (!categoryExists) {
                return res.status(400).send("This category does not exist");
            }
            supabaseQuery.eq('category', category)
        }
        const { data, error } = await supabaseQuery
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
            .select();
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
            .from("doodles")
            .select()
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