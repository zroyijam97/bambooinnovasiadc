import { PrismaClient } from '@prisma/client';

// Global test setup
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db',
    },
  },
});

// Clean up database before each test suite
beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
});

// Clean up after all tests
afterAll(async () => {
  // Clean up test data
  await prisma.vCard.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();
  
  // Disconnect from database
  await prisma.$disconnect();
});

// Set test timeout
jest.setTimeout(30000);

// Mock environment variables for tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.CLERK_SECRET_KEY = 'test-clerk-secret';