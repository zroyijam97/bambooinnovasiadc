"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VcardsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let VcardsService = class VcardsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createVCardDto, organizationId) {
        const { businessHours, services, socialLinks, testimonials, ...vcardData } = createVCardDto;
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
    async findAll(organizationId, status) {
        const where = { organizationId };
        if (status) {
            where.publishStatus = status;
        }
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
    async findAllWithDetails(organizationId, status) {
        const where = { organizationId };
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
    async findOne(id, organizationId) {
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
    async findCardById(id) {
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
    async findBySlug(slug) {
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
    async findBySlugInOrganization(slug, organizationId) {
        return await this.prisma.vCard.findFirst({
            where: {
                slug,
                organizationId,
            },
        });
    }
    async update(id, updateVCardDto, organizationId) {
        const { businessHours, services, socialLinks, testimonials, ...vcardData } = updateVCardDto;
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
    async remove(id, organizationId) {
        return await this.prisma.vCard.delete({
            where: {
                id,
                organizationId,
            },
        });
    }
    async publish(id, organizationId) {
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
};
exports.VcardsService = VcardsService;
exports.VcardsService = VcardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VcardsService);
//# sourceMappingURL=vcards.service.js.map