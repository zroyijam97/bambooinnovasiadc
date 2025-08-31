"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db',
        },
    },
});
beforeAll(async () => {
    await prisma.$connect();
});
afterAll(async () => {
    await prisma.vCard.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
});
jest.setTimeout(30000);
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.CLERK_SECRET_KEY = 'test-clerk-secret';
//# sourceMappingURL=setup.js.map