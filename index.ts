import express from 'express';
import cors from 'cors';
import * as dotenv from "dotenv";

import doodleRouter from './routes/doodles';
import healthRouter from './routes/health';
import analyticsRouter from './routes/doodlebot_analytics';
import { checkAPIKeyMiddleware } from './utils/checkAPIKeyMiddleware';
import { limiter } from './utils/limiter';

dotenv.config();

export const app = express();
app.set("port", process.env.PORT || 3070);

app.set('json spaces', 2);
app.use(express.json());
app.use(cors());
app.use(limiter);

app.get('/', (_req, res) => {
    res.send('Welcome to my Positive Doodle API!')
})

app.use('/health', healthRouter);

app.use('/doodles', doodleRouter);

app.use('/doodlebot_analytics', checkAPIKeyMiddleware, analyticsRouter);