const request = require('supertest');
const app = require('../src/app');

describe('Auth API Validation & Endpoints', () => {
  it('should reject register with invalid email or short password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      full_name: 'Test Admin',
      email: 'not-an-email',
      password: '12',
    });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it('should accept login for default demo admin', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'abhi@gmail.com',
      password: 'abhi',
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('abhi@gmail.com');
  });
});
