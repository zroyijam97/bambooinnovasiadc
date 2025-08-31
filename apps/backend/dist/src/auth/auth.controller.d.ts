import { AuthService } from './auth.service';
import { SyncUserDto } from './dto/sync-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        access_token: string;
    }>;
    register(registerDto: {
        email: string;
        password: string;
        name: string;
    }): Promise<{
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
