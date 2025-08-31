import { Test, TestingModule } from '@nestjs/testing';
import { VcardsController } from './vcards.controller';
import { VcardsService } from './vcards.service';
import { CreateVCardDto } from './dto/create-vcard.dto';
import { UpdateVCardDto } from './dto/update-vcard.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('VcardsController', () => {
  let controller: VcardsController;
  let service: VcardsService;

  const mockVcardsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    publish: jest.fn(),
  };

  const mockRequest = {
    user: {
      id: 'user-123',
      organizationId: 'org-123',
      email: 'test@example.com',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VcardsController],
      providers: [
        {
          provide: VcardsService,
          useValue: mockVcardsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<VcardsController>(VcardsController);
    service = module.get<VcardsService>(VcardsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a vcard successfully', async () => {
      const createVCardDto: CreateVCardDto = {
        slug: 'test-card',
        templateId: 'template-123',
        title: 'Test Card',
        name: 'John Doe',
        jobTitle: 'Software Engineer',
        email: 'john@example.com',
        publishStatus: 'DRAFT',
      };

      const expectedResult = {
        id: 'vcard-123',
        ...createVCardDto,
        organizationId: 'org-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockVcardsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createVCardDto, mockRequest);

      expect(mockVcardsService.create).toHaveBeenCalledWith(
        createVCardDto,
        'org-123'
      );
      expect(result).toEqual(expectedResult);
    });

    it('should throw BadRequestException when slug already exists', async () => {
      const createVCardDto: CreateVCardDto = {
        slug: 'existing-card',
        templateId: 'template-123',
        title: 'Test Card',
        name: 'John Doe',
      };

      const prismaError = new Error('Unique constraint failed');
      prismaError['code'] = 'P2002';
      mockVcardsService.create.mockRejectedValue(prismaError);

      await expect(controller.create(createVCardDto, mockRequest)).rejects.toThrow(
        BadRequestException
      );
      await expect(controller.create(createVCardDto, mockRequest)).rejects.toThrow(
        'A card with this slug already exists'
      );
    });

    it('should rethrow other errors', async () => {
      const createVCardDto: CreateVCardDto = {
        slug: 'test-card',
        templateId: 'template-123',
        title: 'Test Card',
        name: 'John Doe',
      };

      const genericError = new Error('Database connection failed');
      mockVcardsService.create.mockRejectedValue(genericError);

      await expect(controller.create(createVCardDto, mockRequest)).rejects.toThrow(
        'Database connection failed'
      );
    });
  });

  describe('findAll', () => {
    it('should return all vcards for organization', async () => {
      const expectedVCards = [
        {
          id: 'vcard-1',
          slug: 'card-1',
          title: 'Card 1',
          name: 'John Doe',
          organizationId: 'org-123',
        },
        {
          id: 'vcard-2',
          slug: 'card-2',
          title: 'Card 2',
          name: 'Jane Smith',
          organizationId: 'org-123',
        },
      ];

      mockVcardsService.findAll.mockResolvedValue(expectedVCards);

      const result = await controller.findAll(mockRequest);

      expect(mockVcardsService.findAll).toHaveBeenCalledWith('org-123', undefined);
      expect(result).toEqual(expectedVCards);
    });

    it('should return filtered vcards by status', async () => {
      const expectedVCards = [
        {
          id: 'vcard-1',
          slug: 'card-1',
          title: 'Card 1',
          name: 'John Doe',
          organizationId: 'org-123',
          publishStatus: 'PUBLISHED',
        },
      ];

      mockVcardsService.findAll.mockResolvedValue(expectedVCards);

      const result = await controller.findAll(mockRequest, 'PUBLISHED');

      expect(mockVcardsService.findAll).toHaveBeenCalledWith('org-123', 'PUBLISHED');
      expect(result).toEqual(expectedVCards);
    });
  });

  describe('findOne', () => {
    it('should return a vcard by id', async () => {
      const vcardId = 'vcard-123';
      const expectedVCard = {
        id: vcardId,
        slug: 'test-card',
        title: 'Test Card',
        name: 'John Doe',
        organizationId: 'org-123',
      };

      mockVcardsService.findOne.mockResolvedValue(expectedVCard);

      const result = await controller.findOne(vcardId, mockRequest);

      expect(mockVcardsService.findOne).toHaveBeenCalledWith(vcardId, 'org-123');
      expect(result).toEqual(expectedVCard);
    });

    it('should throw NotFoundException when vcard not found', async () => {
      const vcardId = 'non-existent-id';
      mockVcardsService.findOne.mockRejectedValue(
        new NotFoundException('VCard not found')
      );

      await expect(controller.findOne(vcardId, mockRequest)).rejects.toThrow(
        NotFoundException
      );
      await expect(controller.findOne(vcardId, mockRequest)).rejects.toThrow(
        'VCard not found'
      );
    });
  });

  describe('update', () => {
    it('should update a vcard successfully', async () => {
      const vcardId = 'vcard-123';
      const updateVCardDto: UpdateVCardDto = {
        title: 'Updated Card',
        name: 'John Updated',
      };

      const expectedResult = {
        id: vcardId,
        ...updateVCardDto,
        slug: 'test-card',
        organizationId: 'org-123',
        updatedAt: new Date(),
      };

      mockVcardsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(vcardId, updateVCardDto, mockRequest);

      expect(mockVcardsService.update).toHaveBeenCalledWith(
        vcardId,
        updateVCardDto,
        'org-123'
      );
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException when vcard not found for update', async () => {
      const vcardId = 'non-existent-id';
      const updateVCardDto: UpdateVCardDto = {
        title: 'Updated Title',
      };
      mockVcardsService.update.mockRejectedValue(
        new NotFoundException('VCard not found')
      );

      await expect(
        controller.update(vcardId, updateVCardDto, mockRequest)
      ).rejects.toThrow(NotFoundException);
      await expect(
        controller.update(vcardId, updateVCardDto, mockRequest)
      ).rejects.toThrow('VCard not found');
    });
  });

  describe('remove', () => {
    it('should delete a vcard successfully', async () => {
      const vcardId = 'vcard-123';
      const expectedResult = {
        id: vcardId,
        slug: 'test-card',
        title: 'Test Card',
        organizationId: 'org-123',
      };

      mockVcardsService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(vcardId, mockRequest);

      expect(mockVcardsService.remove).toHaveBeenCalledWith(vcardId, 'org-123');
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException when vcard not found for deletion', async () => {
      const vcardId = 'non-existent-id';
      mockVcardsService.remove.mockRejectedValue(
        new NotFoundException('VCard not found')
      );

      await expect(controller.remove(vcardId, mockRequest)).rejects.toThrow(
        NotFoundException
      );
      await expect(controller.remove(vcardId, mockRequest)).rejects.toThrow(
        'VCard not found'
      );
    });
  });

  describe('publish', () => {
    it('should publish a vcard successfully', async () => {
      const vcardId = 'vcard-123';
      const expectedResult = {
        id: vcardId,
        slug: 'test-card',
        title: 'Test Card',
        organizationId: 'org-123',
        publishStatus: 'PUBLISHED',
        updatedAt: new Date(),
      };

      mockVcardsService.publish.mockResolvedValue(expectedResult);

      const result = await controller.publish(vcardId, mockRequest);

      expect(mockVcardsService.publish).toHaveBeenCalledWith(vcardId, 'org-123');
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException when vcard not found for publishing', async () => {
      const vcardId = 'non-existent-id';
      mockVcardsService.publish.mockRejectedValue(
        new NotFoundException('VCard not found')
      );

      await expect(controller.publish(vcardId, mockRequest)).rejects.toThrow(
        NotFoundException
      );
      await expect(controller.publish(vcardId, mockRequest)).rejects.toThrow(
        'VCard not found'
      );
    });
  });
});