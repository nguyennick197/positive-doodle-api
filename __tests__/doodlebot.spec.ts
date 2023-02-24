import request from "supertest";
import { app } from "../index";

describe('test doodlebot analytics endpoints', () => {
    it("should respond with error for no api key", async () => {
        const res = await request(app).get(`/doodlebot_analytics`)
        expect(res.statusCode).toEqual(401);
    });
});