import request from 'supertest';
import app from '../../src/app';

describe('App health check', () => {
  it('GET / should return API status', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'API is running!' });
  });
});
