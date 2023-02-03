import express, { Request, Response } from "express";

const router = express.Router();

interface HealthObject {
    uptime: number;
    message: string | unknown;
    timestamp: number;
}

router.route('/').get(async (_req: Request, res: Response) => {
    const apiHealth: HealthObject = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now(),
    };
    try {
        res.send(apiHealth);
    } catch (error ) {
        apiHealth.message = error;
        res.status(503).send(apiHealth);
    }
});

export default router;