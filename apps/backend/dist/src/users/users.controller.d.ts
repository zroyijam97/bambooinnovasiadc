import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    update(id: string, updateUserDto: any): Promise<{
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
