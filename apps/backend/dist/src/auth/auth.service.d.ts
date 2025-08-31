import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { SyncUserDto } from './dto/sync-user.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
    }>;
    register(email: string, password: string, name: string): Promise<{
        id: string;
        email: string;
        name: string;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.UserStatus;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    syncUser(syncUserDto: SyncUserDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
            status: import(".prisma/client").$Enums.UserStatus;
            emailVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        organizationId: string;
        access_token: string;
    }>;
}
