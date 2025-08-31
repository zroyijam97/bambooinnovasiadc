import { OrganizationsService } from './organizations.service';
export declare class OrganizationsController {
    private readonly organizationsService;
    constructor(organizationsService: OrganizationsService);
    create(createOrgDto: {
        name: string;
        logo?: string;
    }, req: any): Promise<{
        id: string;
        name: string;
        logo: string | null;
        ownerId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(req: any): Promise<({
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
    update(id: string, updateOrgDto: {
        name?: string;
        logo?: string;
    }): Promise<{
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
