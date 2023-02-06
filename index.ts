import express from 'express';
import cors from 'cors';
import * as dotenv from "dotenv";

import doodleRouter from './routes/doodles';
import healthRouter from './routes/health';
import analyticsRouter from './routes/doodlebot_analytics';
import { checkAPIKeyMiddleware } from './utils/checkAPIKeyMiddleware';
import { limiter } from './utils/limiter';

dotenv.config();

const app = express();

app.set('json spaces', 2);
app.use(express.json());
app.use(cors());
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