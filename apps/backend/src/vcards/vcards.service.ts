import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVCardDto } from './dto/create-vcard.dto';
import { UpdateVCardDto } from './dto/update-vcard.dto';

@Injectable()
export class VcardsService {
  constructor(private prisma: PrismaService) {}

  async create(createVCardDto: CreateVCardDto, organizationId: string) {
    const {
      businessHours,
      services,
      socialLinks,
      testimonials,
      ...vcardData
    } = createVCardDto;

    return await this.prisma.vCard.create({
      data: {
        ...vcardData,
        organizationId,
        businessHours: businessHours
          ? {
              create: businessHours,
            }
          : undefined,
        services: services
          ? {
              create: services,
            }
          : undefined,
        socialLinks: socialLinks
          ? {
              create: socialLinks,
            }
          : undefined,
        testimonials: testimonials
          ? {
              create: testimonials,
            }
          : undefined,
      },
      include: {
        businessHours: true,
        services: true,
        socialLinks: true,
        testimonials: true,
      },
    });
  }

  async findAll(organizationId: string, status?: string) {
    const where: any = { organizationId };
    if (status) {
      where.publishStatus = status;
    }

    // Optimized query for dashboard - only load essential data
    return await this.prisma.vCard.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        name: true,
        jobTitle: true,
        company: true,
        bio: true,
        avatar: true,
        publishStatus: true,
        createdAt: true,
        updatedAt: true,
        // Only count related items instead of loading full data
        _count: {
          select: {
            services: true,
            socialLinks: true,
            testimonials: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  // New method for getting full VCard details when needed
  async findAllWithDetails(organizationId: string, status?: string) {
    const where: any = { organizationId };
    if (status) {
      where.publishStatus = status;
    }

    return await this.prisma.vCard.findMany({
      where,
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
  }

  async findOne(id: string, organizationId: string) {
    return await this.prisma.vCard.findFirst({
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
  }

  async findCardById(id: string) {
    return await this.prisma.vCard.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        organizationId: true,
        slug: true,
        title: true,
      },
    });
  }

  async findBySlug(slug: string) {
    return await this.prisma.vCard.findFirst({
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
  }

  async findBySlugInOrganization(slug: string, organizationId: string) {
    return await this.prisma.vCard.findFirst({
      where: {
        slug,
        organizationId,
      },
    });
  }

  async update(id: string, updateVCardDto: UpdateVCardDto, organizationId: string) {
    const {
      businessHours,
      services,
      socialLinks,
      testimonials,
      ...vcardData
    } = updateVCardDto;

    // First, delete existing related records if new ones are provided
    if (businessHours) {
      await this.prisma.businessHours.deleteMany({
        where: { vcardId: id },
      });
    }
    if (services) {
      await this.prisma.service.deleteMany({
        where: { vcardId: id },
      });
    }
    if (socialLinks) {
      await this.prisma.socialLink.deleteMany({
        where: { vcardId: id },
      });
    }
    if (testimonials) {
      await this.prisma.testimonial.deleteMany({
        where: { vcardId: id },
      });
    }

    return await this.prisma.vCard.update({
      where: {
        id,
        organizationId,
      },
      data: {
        ...vcardData,
        businessHours: businessHours
          ? {
              create: businessHours,
            }
          : undefined,
        services: services
          ? {
              create: services,
            }
          : undefined,
        socialLinks: socialLinks
          ? {
              create: socialLinks,
            }
          : undefined,
        testimonials: testimonials
          ? {
              create: testimonials,
            }
          : undefined,
      },
      include: {
        businessHours: true,
        services: true,
        socialLinks: true,
        testimonials: true,
      },
    });
  }

  async remove(id: string, organizationId: string) {
    return await this.prisma.vCard.delete({
      where: {
        id,
        organizationId,
      },
    });
  }

  async publish(id: string, organizationId: string) {
    return await this.prisma.vCard.update({
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
  }
}