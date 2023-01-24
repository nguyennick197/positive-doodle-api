const express = require("express");

const router = express.Router();

router.route('/').get(async (req, res) => {
    const apiHealth = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
    };
    try {
        res.send(apiHealth);
    } catch (error) {
        apiHealth.message = error;
        res.status(503).send(apiHealth);
    }
});

module.exports = router;