const { supabase } = require("../supabase.js");
const express = require('express')

const router = express.Router();

router.route('/').get(async (req, res) => {
    const page = req.query.page || 1;
    const perPage = req.query.per_page || 20;

    const offset = (page - 1) * perPage;
    const rangeEnd = offset + perPage

    const { data, error } = await supabase
        .from("doodles")
        .select()
        .limit(perPage)
        .range(offset, rangeEnd)

    if (error) {
        console.error(err);
        res.status(500).send("Error when querying the doodles table.")
    }

    res.json(data)
});

router.route('/random').get(async (req, res) => {
    const { data, error } = await supabase
        .from("random_doodle")
        .select()
        .limit(1)
        .single()

    if (error) {
        console.error(err);
        res.status(500).send("Error when querying the random doodles table.")
    }

    res.json(data)
})

router.route('/:id').get(async (req, res) => {
    const id = req.params.id

    const { data, error } = await supabase
        .from("doodles")
        .select()
        .eq('id', id)
        .limit(1)
        .single()

    if (error) {
        console.error(err);
        res.status(500).send("Error when querying the random doodles table.")
    }

    res.json(data)
})

module.exports = router;