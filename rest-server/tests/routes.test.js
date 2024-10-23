import request from 'supertest';
import express from 'express';
import router from '../route.js';

const app = express();
app.use(router);

describe('GET /', () => {
    it('should return Hello, Darling!', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toBe('Hello, Darling!');
    });
});
