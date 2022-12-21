const { supabase } = require("../supabase.js");
const { doesCategoryExist } = require('../utils/categories')
const express = require('express')

const router = express.Router();

router.route('/').get(async (req, res) => {
    const page = req.query.page || 1;
    const perPage = req.query.per_page || 20;

    const offset = (page - 1) * perPage;
    const rangeEnd = offset + perPage;

    try {
        const { data, error } = await supabase
            .from("doodles")
            .select()
            .limit(perPage)
            .range(offset, rangeEnd);

        if (error) {
            console.error(error);
            return res.status(500).send("Error when querying the doodles table.");
        }
        return res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.route('/random').get(async (req, res) => {
    const category = req.query.category;

    const supabaseQuery = supabase
        .from("random_doodle")
        .select()
        .limit(1)
        .single();


    if (category) {
        const categoryExists = doesCategoryExist(category)
        if (!categoryExists) {
            return res.status(500).send("This category does not exist");
        }
        supabaseQuery.eq('category', category)
    }

    const { data, error } = await supabaseQuery

    if (error) {
        console.error(error);
        return res.status(500).send("Error when querying the random doodles table.");
    }
    return res.json(data);
});

router.route('/categories').get(async (req, res) => {
    const { data, error } = await supabase
        .from("categories")
        .select();

    if (error) {
        console.error(error);
        return res.status(500).send("Error getting the categories view.");
    }

    return res.json(data);
});

router.route('/:id').get(async (req, res) => {
    const id = req.params.id;

    const { data, error } = await supabase
        .from("doodles")
        .select()
        .eq('id', id)
        .limit(1)
        .single();

    if (error) {
        console.error(error);
        return res.status(500).send("Error when querying the doodles table.");
    }
    return res.json(data);
});

module.exports = router;