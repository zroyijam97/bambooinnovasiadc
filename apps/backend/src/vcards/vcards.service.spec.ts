import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { VcardsService } from './vcards.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVCardDto } from './dto/create-vcard.dto';
import { UpdateVCardDto } from './dto/update-vcard.dto';

describe('VcardsService', () => {
  let service: VcardsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    vCard: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VcardsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<VcardsService>(VcardsService);
    prismaService = module.get<PrismaService>(PrismaService);
    
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new vcard', async () => {
      const organizationId = 'org-123';
      const createVCardDto: CreateVCardDto = {
        slug: 'test-card',
        templateId: 'template-123',
        title: 'Test Card',
        name: 'John Doe',
        jobTitle: 'Software Engineer',
        email: 'john@example.com',
        phone: '+1234567890',
        publishStatus: 'DRAFT',
      };

      const expectedVCard = {
        id: 'vcard-123',
        ...createVCardDto,
        organizationId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.vCard.create.mockResolvedValue(expectedVCard);

      const result = await service.create(createVCardDto, organizationId);

      expect(mockPrismaService.vCard.create).toHaveBeenCalledWith({
        data: {
          ...createVCardDto,
          organizationId,
        },
        include: {
          businessHours: true,
          services: true,
          socialLinks: true,
          testimonials: true,
        },
      });
      expect(result).toEqual(expectedVCard);
    });
  });

  describe('findAll', () => {
    it('should return all vcards for organization', async () => {
      const organizationId = 'org-123';
      const expectedVCards = [
        {
          id: 'vcard-1',
          slug: 'card-1',
          title: 'Card 1',
          organizationId,
        },
        {
          id: 'vcard-2',
          slug: 'card-2',
          title: 'Card 2',
          organizationId,
        },
      ];

      mockPrismaService.vCard.findMany.mockResolvedValue(expectedVCards);

      const result = await service.findAll(organizationId);

      expect(mockPrismaService.vCard.findMany).toHaveBeenCalledWith({
        where: {
          organizationId,
        },
        include: {
          businessHours: true,
          services: true,
          socialLinks: true,
          testimonials: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
      expect(result).toEqual(expectedVCards);
    });

    it('should filter vcards by status', async () => {
      const organizationId = 'org-123';
      const status = 'PUBLISHED';
      const expectedVCards = [
        {
          id: 'vcard-1',
          slug: 'card-1',
          title: 'Card 1',
          publishStatus: 'PUBLISHED',
          organizationId,
        },
      ];

      mockPrismaService.vCard.findMany.mockResolvedValue(expectedVCards);

      const result = await service.findAll(organizationId, status);

      expect(mockPrismaService.vCard.findMany).toHaveBeenCalledWith({
        where: {
          organizationId,
          publishStatus: status,
        },
        include: {
          businessHours: true,
          services: true,
          socialLinks: true,
          testimonials: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });
      expect(result).toEqual(expectedVCards);
    });
  });

  describe('findOne', () => {
    it('should return a vcard by id', async () => {
      const id = 'vcard-123';
      const organizationId = 'org-123';
      const expectedVCard = {
        id,
        slug: 'test-card',
        title: 'Test Card',
        organizationId,
      };

      mockPrismaService.vCard.findFirst.mockResolvedValue(expectedVCard);

      const result = await service.findOne(id, organizationId);

      expect(mockPrismaService.vCard.findFirst).toHaveBeenCalledWith({
        where: {
          id,
          organizationId,
        },
        include: {
          businessHours: true,
          services: true,
          socialLinks: true,
          testimonials: true,
        },
      });
      expect(result).toEqual(expectedVCard);
    });

    it('should return null if vcard not found', async () => {
      const id = 'non-existent-id';
      const organizationId = 'org-123';

      mockPrismaService.vCard.findFirst.mockResolvedValue(null);

      const result = await service.findOne(id, organizationId);

      expect(result).toBeNull();
    });
  });

  describe('findBySlug', () => {
    it('should return a vcard by slug', async () => {
      const slug = 'test-card';
      const expectedVCard = {
        id: 'vcard-123',
        slug,
        title: 'Test Card',
      };

      mockPrismaService.vCard.findFirst.mockResolvedValue(expectedVCard);

      const result = await service.findBySlug(slug);

      expect(mockPrismaService.vCard.findFirst).toHaveBeenCalledWith({
        where: {
          slug,
          publishStatus: 'PUBLISHED',
        },
        include: {
          businessHours: true,
          services: true,
          socialLinks: true,
          testimonials: true,
        },
      });
      expect(result).toEqual(expectedVCard);
    });

    it('should return null if vcard not found', async () => {
      const slug = 'non-existent-slug';

      mockPrismaService.vCard.findFirst.mockResolvedValue(null);

      const result = await service.findBySlug(slug);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a vcard', async () => {
      const id = 'vcard-123';
      const organizationId = 'org-123';
      const updateVCardDto: UpdateVCardDto = {
        title: 'Updated Card',
        name: 'John Updated',
      };

      const expectedVCard = {
        id,
        ...updateVCardDto,
        organizationId,
        updatedAt: new Date(),
      };

      mockPrismaService.vCard.update.mockResolvedValue(expectedVCard);

      const result = await service.update(id, updateVCardDto, organizationId);

      expect(mockPrismaService.vCard.update).toHaveBeenCalledWith({
        where: {
          id,
          organizationId,
        },
        data: updateVCardDto,
        include: {
          businessHours: true,
          services: true,
          socialLinks: true,
          testimonials: true,
        },
      });
      expect(result).toEqual(expectedVCard);
    });
  });

  describe('remove', () => {
    it('should delete a vcard', async () => {
      const id = 'vcard-123';
      const organizationId = 'org-123';
      const expectedVCard = {
        id,
        slug: 'test-card',
        title: 'Test Card',
        organizationId,
      };

      mockPrismaService.vCard.delete.mockResolvedValue(expectedVCard);

      const result = await service.remove(id, organizationId);

      expect(mockPrismaService.vCard.delete).toHaveBeenCalledWith({
        where: {
          id,
          organizationId,
        },
      });
      expect(result).toEqual(expectedVCard);
    });
  });

  describe('publish', () => {
    it('should publish a vcard', async () => {
      const id = 'vcard-123';
      const organizationId = 'org-123';
      const expectedVCard = {
        id,
        slug: 'test-card',
        title: 'Test Card',
        publishStatus: 'PUBLISHED',
        organizationId,
      };

      mockPrismaService.vCard.update.mockResolvedValue(expectedVCard);

      const result = await service.publish(id, organizationId);

      expect(mockPrismaService.vCard.update).toHaveBeenCalledWith({
        where: {
          id,
          organizationId,
        },
        data: {
          publishStatus: 'PUBLISHED',
        },
        include: {
          businessHours: true,
          services: true,
          socialLinks: true,
          testimonials: true,
        },
      });
      expect(result).toEqual(expectedVCard);
    });
  });
});