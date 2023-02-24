import request from "supertest";
import { app } from "../index";

describe("test doodles endpoints", () => {
    it("should return list of doodles", async () => {
        const res = await request(app).get('/doodles');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
    });

    it("should return accurate number of doodles", async () => {
        const res = await request(app).get('/doodles?page=1&per_page=10');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveLength(10);
    });

    it("should return random doodle with accurate tag", async () => {
        const res = await request(app).get('/doodles/random?tag=cat');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.tags).toContain("cat");
    });

    it("should return error for non-existent tag", async () => {
        const res = await request(app).get('/doodles/random?tag=abdcasd');
        expect(res.statusCode).toEqual(500);
    });

    it("should return single doodle", async () => {
        const res = await request(app).get('/doodles/100');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id');
    });

    it("should return error for non-existant doodle", async () => {
        const res = await request(app).get('/doodles/0');
        expect(res.statusCode).toEqual(500);
    });
});

