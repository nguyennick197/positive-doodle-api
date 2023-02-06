import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import * as dotenv from "dotenv";

import doodleRouter from './routes/doodles';
import healthRouter from './routes/health';
import analyticsRouter from './routes/doodlebot_analytics';
import { checkAPIKeyMiddleware } from './utils/checkAPIKeyMiddleware';

dotenv.config();
const app = express();
app.set('json spaces', 2);
app.use(express.json());
app.use(cors());

// limit api usage to 100 requests per minute, except for whitelisted IP and URL
let whitelisted_ips: (string | undefined)[] = process.env.WHITELIST_IP!.split(",");
let whitelisted_urls: (string | undefined)[] = process.env.WHITELIST_URL!.split(",");
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    skip: (req) => {
        return (whitelisted_ips.includes(req.ip) ||
            whitelisted_urls.includes(req.headers.referer));
    }
});
app.use(limiter);

const port = process.env.PORT || 3070;

app.get('/', (req, res) => {
    res.send('Welcome to my Positive Doodle API!')
})

app.use('/health', healthRouter);

app.use('/doodles', doodleRouter);

app.use('/doodlebot_analytics', checkAPIKeyMiddleware, analyticsRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});