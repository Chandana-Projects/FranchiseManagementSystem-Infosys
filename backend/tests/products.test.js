const request = require('supertest');
const app = require('../src/app');

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    products: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Products API', () => {
  it('should return a list of products', async () => {
    prisma.products.findMany.mockResolvedValue([{ product_name: 'Test Product', sku: 'TST-01', unit_price: 10 }]);
    
    const response = await request(app).get('/api/products');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].sku).toBe('TST-01');
  });

  it('should return 400 for validation failure on create', async () => {
    const invalidPayload = {
      product_name: '', // Empty name triggers Zod error
      sku: 'TST-02',
      unit_price: -5, // Negative triggers error
    };

    const response = await request(app).post('/api/products').send(invalidPayload);
    
    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.errors.length).toBeGreaterThan(0);
  });
});
