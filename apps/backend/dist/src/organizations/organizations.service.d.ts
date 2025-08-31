import { PrismaService } from '../prisma/prisma.service';
export declare class OrganizationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        logo: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findAllForUser(userId: string): Promise<({
        members: ({
            user: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            role: import(".prisma/client").$Enums.MemberRole;
            userId: string;
            organizationId: string;
        })[];
    } & {
        id: string;
        name: string;
        logo: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        logo: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(data: any): Promise<{
        id: string;
        name: string;
        logo: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        name: string;
        logo: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        logo: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
