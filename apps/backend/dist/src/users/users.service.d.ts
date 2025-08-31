import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        emailVerified: boolean;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        emailVerified: boolean;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        emailVerified: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        status: import(".prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string;
        role: import(".prisma/client").$Enums.Role;
        emailVerified: boolean;
    }>;
}
