import { VcardsService } from './vcards.service';
import { CreateVCardDto } from './dto/create-vcard.dto';
import { UpdateVCardDto } from './dto/update-vcard.dto';
export declare class VcardsController {
    private readonly vcardsService;
    constructor(vcardsService: VcardsService);
    create(createVCardDto: CreateVCardDto, req: any): Promise<{
        businessHours: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            day: import(".prisma/client").$Enums.DayOfWeek;
            openTime: string | null;
            closeTime: string | null;
            isClosed: boolean;
            vcardId: string;
        }[];
        services: {
            id: string;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            vcardId: string;
            description: string | null;
            price: number | null;
            currency: string | null;
            order: number;
        }[];
        socialLinks: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            vcardId: string;
            order: number;
            platform: string;
            url: string;
        }[];
        testimonials: {
            id: string;
            name: string;
            avatar: string | null;
            createdAt: Date;
            updatedAt: Date;
            vcardId: string;
            order: number;
            rating: number;
            text: string;
        }[];
    } & {
        id: string;
        slug: string;
        title: string;
        name: string;
        jobTitle: string | null;
        company: string | null;
        bio: string | null;
        avatar: string | null;
        banner: string | null;
        phone: string | null;
        email: string | null;
        website: string | null;
        address: string | null;
        themeConfig: import("@prisma/client/runtime/library").JsonValue;
        fontId: string | null;
        publishStatus: import(".prisma/client").$Enums.PublishStatus;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        templateId: string;
    }>;
    findAll(req: any, status?: string, slug?: string): Promise<{
        id: string;
        slug: string;
        title: string;
        name: string;
        jobTitle: string;
        company: string;
        bio: string;
        avatar: string;
        publishStatus: import(".prisma/client").$Enums.PublishStatus;
        createdAt: Date;
        updatedAt: Date;
        _count: {
            services: number;
            socialLinks: number;
            testimonials: number;
        };
    }[] | {
        available: boolean;
    }>;
    findOne(id: string, req: any): Promise<{
        businessHours: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            day: import(".prisma/client").$Enums.DayOfWeek;
            openTime: string | null;
            closeTime: string | null;
            isClosed: boolean;
            vcardId: string;
        }[];
        services: {
            id: string;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            vcardId: string;
            description: string | null;
            price: number | null;
            currency: string | null;
            order: number;
        }[];
        socialLinks: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            vcardId: string;
            order: number;
            platform: string;
            url: string;
        }[];
        testimonials: {
            id: string;
            name: string;
            avatar: string | null;
            createdAt: Date;
            updatedAt: Date;
            vcardId: string;
            order: number;
            rating: number;
            text: string;
        }[];
    } & {
        id: string;
        slug: string;
        title: string;
        name: string;
        jobTitle: string | null;
        company: string | null;
        bio: string | null;
        avatar: string | null;
        banner: string | null;
        phone: string | null;
        email: string | null;
        website: string | null;
        address: string | null;
        themeConfig: import("@prisma/client/runtime/library").JsonValue;
        fontId: string | null;
        publishStatus: import(".prisma/client").$Enums.PublishStatus;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        templateId: string;
    }>;
    update(id: string, updateVCardDto: UpdateVCardDto, req: any): Promise<{
        businessHours: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            day: import(".prisma/client").$Enums.DayOfWeek;
            openTime: string | null;
            closeTime: string | null;
            isClosed: boolean;
            vcardId: string;
        }[];
        services: {
            id: string;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            vcardId: string;
            description: string | null;
            price: number | null;
            currency: string | null;
            order: number;
        }[];
        socialLinks: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            vcardId: string;
            order: number;
            platform: string;
            url: string;
        }[];
        testimonials: {
            id: string;
            name: string;
            avatar: string | null;
            createdAt: Date;
            updatedAt: Date;
            vcardId: string;
            order: number;
            rating: number;
            text: string;
        }[];
    } & {
        id: string;
        slug: string;
        title: string;
        name: string;
        jobTitle: string | null;
        company: string | null;
        bio: string | null;
        avatar: string | null;
        banner: string | null;
        phone: string | null;
        email: string | null;
        website: string | null;
        address: string | null;
        themeConfig: import("@prisma/client/runtime/library").JsonValue;
        fontId: string | null;
        publishStatus: import(".prisma/client").$Enums.PublishStatus;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        templateId: string;
    }>;
    remove(id: string, req: any): Promise<{
        id: string;
        slug: string;
        title: string;
        name: string;
        jobTitle: string | null;
        company: string | null;
        bio: string | null;
        avatar: string | null;
        banner: string | null;
        phone: string | null;
        email: string | null;
        website: string | null;
        address: string | null;
        themeConfig: import("@prisma/client/runtime/library").JsonValue;
        fontId: string | null;
        publishStatus: import(".prisma/client").$Enums.PublishStatus;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        templateId: string;
    }>;
    publish(id: string, req: any): Promise<{
        businessHours: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            day: import(".prisma/client").$Enums.DayOfWeek;
            openTime: string | null;
            closeTime: string | null;
            isClosed: boolean;
            vcardId: string;
        }[];
        services: {
            id: string;
            title: string;
            createdAt: Date;
            updatedAt: Date;
            vcardId: string;
            description: string | null;
            price: number | null;
            currency: string | null;
            order: number;
        }[];
        socialLinks: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            vcardId: string;
            order: number;
            platform: string;
            url: string;
        }[];
        testimonials: {
            id: string;
            name: string;
            avatar: string | null;
            createdAt: Date;
            updatedAt: Date;
            vcardId: string;
            order: number;
            rating: number;
            text: string;
        }[];
    } & {
        id: string;
        slug: string;
        title: string;
        name: string;
        jobTitle: string | null;
        company: string | null;
        bio: string | null;
        avatar: string | null;
        banner: string | null;
        phone: string | null;
        email: string | null;
        website: string | null;
        address: string | null;
        themeConfig: import("@prisma/client/runtime/library").JsonValue;
        fontId: string | null;
        publishStatus: import(".prisma/client").$Enums.PublishStatus;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        templateId: string;
    }>;
}
