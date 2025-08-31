import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';

describe('VCards (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  const mockUser = {
    id: 'user-123',
    organizationId: 'org-123',
    email: 'test@example.com',
  };

  const mockAuthGuard = {
    canActivate: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    
    // Set up global validation pipe like in main.ts
    app.useGlobalPipes();
    app.setGlobalPrefix('api/v1');
    
    await app.init();
  });

  beforeEach(async () => {
    // Clean up existing data
    await prismaService.vCard.deleteMany({});
    await prismaService.organization.deleteMany({});
    await prismaService.user.deleteMany({});
    await prismaService.template.deleteMany({});
    
    // Create test user first
    const testUser = await prismaService.user.create({
      data: {
        id: mockUser.id,
        email: mockUser.email,
        name: 'Test User',
        password: 'hashedpassword',
      },
    });
    
    // Create test template
    await prismaService.template.create({
      data: {
        id: 'template-123',
        name: 'Test Template',
        config: {
          layout: 'classic',
          colors: { primary: '#10B981' },
        },
        status: 'LIVE',
      },
    });
    
    // Create test organization
    await prismaService.organization.create({
      data: {
        id: mockUser.organizationId,
        name: 'Test Organization',
        ownerId: testUser.id,
      },
    });
    
    // Mock the request user for each test
    jest.spyOn(mockAuthGuard, 'canActivate').mockImplementation((context: any) => {
      const request = context.switchToHttp().getRequest();
      request.user = mockUser;
      return true;
    });
  });

  afterEach(async () => {
    // Clean up test data
    await prismaService.vCard.deleteMany({});
    await prismaService.organization.deleteMany({});
    await prismaService.user.deleteMany({});
    await prismaService.template.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/v1/vcards (POST)', () => {
    it('should create a new vcard', async () => {
      const createVCardDto = {
        slug: 'test-card-e2e',
        templateId: 'template-123',
        title: 'Test Card E2E',
        name: 'John Doe',
        jobTitle: 'Software Engineer',
        email: 'john@example.com',
        phone: '+1234567890',
        publishStatus: 'DRAFT',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/vcards')
        .send(createVCardDto)
        .expect(201);

      expect(response.body).toMatchObject({
        slug: createVCardDto.slug,
        title: createVCardDto.title,
        name: createVCardDto.name,
        organizationId: mockUser.organizationId,
      });
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
    });

    it('should create a vcard with business hours', async () => {
      const createVCardDto = {
        slug: 'test-card-with-hours',
        templateId: 'template-123',
        title: 'Test Card with Hours',
        name: 'Jane Doe',
        businessHours: [
          {
            day: 'MONDAY',
            openTime: '09:00',
            closeTime: '17:00',
            isClosed: false,
          },
          {
            day: 'SATURDAY',
            isClosed: true,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/vcards')
        .send(createVCardDto)
        .expect(201);

      expect(response.body.businessHours).toHaveLength(2);
      expect(response.body.businessHours[0]).toMatchObject({
        day: 'MONDAY',
        openTime: '09:00',
        closeTime: '17:00',
        isClosed: false,
      });
    });

    it('should return 400 for duplicate slug', async () => {
      const createVCardDto = {
        slug: 'duplicate-slug',
        templateId: 'template-123',
        title: 'First Card',
        name: 'John Doe',
      };

      // Create first card
      await request(app.getHttpServer())
        .post('/api/v1/vcards')
        .send(createVCardDto)
        .expect(201);

      // Try to create second card with same slug
      const duplicateDto = {
        ...createVCardDto,
        title: 'Second Card',
      };

      await request(app.getHttpServer())
        .post('/api/v1/vcards')
        .send(duplicateDto)
        .expect(400);
    });

    it('should return 400 for invalid data', async () => {
      const invalidDto = {
        // Missing required fields
        title: 'Test Card',
      };

      await request(app.getHttpServer())
        .post('/api/v1/vcards')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('/api/v1/vcards (GET)', () => {
    beforeEach(async () => {
      // Clean up and create test data
      await prismaService.vCard.deleteMany({
        where: { organizationId: mockUser.organizationId },
      });

      await prismaService.vCard.createMany({
        data: [
          {
            slug: 'published-card',
            templateId: 'template-123',
            title: 'Published Card',
            name: 'John Published',
            organizationId: mockUser.organizationId,
            publishStatus: 'PUBLISHED',
          },
          {
            slug: 'draft-card',
            templateId: 'template-123',
            title: 'Draft Card',
            name: 'John Draft',
            organizationId: mockUser.organizationId,
            publishStatus: 'DRAFT',
          },
        ],
      });
    });

    it('should return all vcards for organization', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/vcards')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body.map(card => card.title)).toContain('Published Card');
      expect(response.body.map(card => card.title)).toContain('Draft Card');
    });

    it('should filter vcards by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/vcards?status=PUBLISHED')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].title).toBe('Published Card');
      expect(response.body[0].publishStatus).toBe('PUBLISHED');
    });
  });

  describe('/api/v1/vcards/:id (GET)', () => {
    let testVCardId: string;

    beforeEach(async () => {
      const vcard = await prismaService.vCard.create({
        data: {
          slug: 'test-get-card',
          templateId: 'template-123',
          title: 'Test Get Card',
          name: 'John Get',
          organizationId: mockUser.organizationId,
          publishStatus: 'PUBLISHED',
        },
      });
      testVCardId = vcard.id;
    });

    it('should return a vcard by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/vcards/${testVCardId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: testVCardId,
        slug: 'test-get-card',
        title: 'Test Get Card',
        name: 'John Get',
      });
    });

    it('should return 404 for non-existent vcard', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/vcards/non-existent-id')
        .expect(404);
    });
  });

  describe('/api/v1/vcards/:id (PATCH)', () => {
    let testVCardId: string;

    beforeEach(async () => {
      const vcard = await prismaService.vCard.create({
        data: {
          slug: 'test-update-card',
          templateId: 'template-123',
          title: 'Test Update Card',
          name: 'John Update',
          organizationId: mockUser.organizationId,
          publishStatus: 'DRAFT',
        },
      });
      testVCardId = vcard.id;
    });

    it('should update a vcard', async () => {
      const updateDto = {
        title: 'Updated Card Title',
        name: 'John Updated',
        jobTitle: 'Senior Engineer',
      };

      const response = await request(app.getHttpServer())
        .patch(`/api/v1/vcards/${testVCardId}`)
        .send(updateDto)
        .expect(200);

      expect(response.body).toMatchObject({
        id: testVCardId,
        title: 'Updated Card Title',
        name: 'John Updated',
        jobTitle: 'Senior Engineer',
      });
    });

    it('should return 404 for non-existent vcard', async () => {
      const updateDto = {
        title: 'Updated Title',
      };

      await request(app.getHttpServer())
        .patch('/api/v1/vcards/non-existent-id')
        .send(updateDto)
        .expect(404);
    });
  });

  describe('/api/v1/vcards/:id (DELETE)', () => {
    let testVCardId: string;

    beforeEach(async () => {
      const vcard = await prismaService.vCard.create({
        data: {
          slug: 'test-delete-card',
          templateId: 'template-123',
          title: 'Test Delete Card',
          name: 'John Delete',
          organizationId: mockUser.organizationId,
          publishStatus: 'DRAFT',
        },
      });
      testVCardId = vcard.id;
    });

    it('should delete a vcard', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/vcards/${testVCardId}`)
        .expect(200);

      // Verify the vcard is deleted
      const deletedVCard = await prismaService.vCard.findUnique({
        where: { id: testVCardId },
      });
      expect(deletedVCard).toBeNull();
    });

    it('should return 404 for non-existent vcard', async () => {
      await request(app.getHttpServer())
        .delete('/api/v1/vcards/non-existent-id')
        .expect(404);
    });
  });

  describe('/api/v1/vcards/:id/publish (POST)', () => {
    let testVCardId: string;

    beforeEach(async () => {
      const vcard = await prismaService.vCard.create({
        data: {
          slug: 'test-publish-card',
          templateId: 'template-123',
          title: 'Test Publish Card',
          name: 'John Publish',
          organizationId: mockUser.organizationId,
          publishStatus: 'DRAFT',
        },
      });
      testVCardId = vcard.id;
    });

    it('should publish a vcard', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/v1/vcards/${testVCardId}/publish`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: testVCardId,
        publishStatus: 'PUBLISHED',
      });
    });

    it('should return 404 for non-existent vcard', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/vcards/non-existent-id/publish')
        .expect(404);
    });
  });
});