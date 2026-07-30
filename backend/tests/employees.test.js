const request = require('supertest');
const app = require('../src/app');

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    employees: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Employees API', () => {
  it('should validate email correctly on create', async () => {
    const invalidPayload = {
      full_name: 'John Doe',
      email: 'invalid-email',
      role: 'Manager',
      outlet_id: 1
    };

    const response = await request(app).post('/api/employees').send(invalidPayload);
    
    expect(response.status).toBe(400);
    expect(response.body.errors[0].message).toContain('Invalid email');
  });

  it('should call prisma create and return 201 on valid input', async () => {
    const validPayload = {
      full_name: 'John Doe',
      email: 'john@example.com',
      role: 'Manager',
      outlet_id: 1,
      salary: 50000
    };

    prisma.employees.create.mockResolvedValue({ id: 1, ...validPayload });

    const response = await request(app).post('/api/employees').send(validPayload);
    
    expect(response.status).toBe(201);
    expect(response.body.email).toBe('john@example.com');
  });
});
