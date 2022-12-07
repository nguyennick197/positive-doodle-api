const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const doodleRouter = require('./routes/doodles');

const app = express();
app.use(cors());

// limit api usage to 100 requests per minute, except for whitelisted IP and URL
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100, 
    skip: (req) => {
        return (req.ip === process.env.WHITELIST_IP ||
            req.headers.referer === process.env.WHITELIST_URL);
    }
});
app.use(limiter);

const port = process.env.PORT || 3070;

app.use('/doodles', doodleRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});