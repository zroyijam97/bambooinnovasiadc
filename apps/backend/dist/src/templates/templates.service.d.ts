import { PrismaService } from '../prisma/prisma.service';
export declare class TemplatesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TemplateStatus;
        version: string;
        config: import("@prisma/client/runtime/library").JsonValue;
        preview: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.TemplateStatus;
        version: string;
        config: import("@prisma/client/runtime/library").JsonValue;
        preview: string | null;
    }>;
}
