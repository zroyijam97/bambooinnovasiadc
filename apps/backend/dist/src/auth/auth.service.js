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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async register(email, password, name) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
        const { password: _, ...result } = user;
        return result;
    }
    async syncUser(syncUserDto) {
        let user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { id: syncUserDto.id },
                    { email: syncUserDto.email }
                ]
            },
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    id: syncUserDto.id,
                    email: syncUserDto.email,
                    name: syncUserDto.name,
                    password: syncUserDto.password,
                    emailVerified: syncUserDto.emailVerified || false,
                },
            });
        }
        else {
            user = await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    name: syncUserDto.name,
                    emailVerified: syncUserDto.emailVerified || user.emailVerified,
                },
            });
        }
        let organization = await this.prisma.organization.findFirst({
            where: {
                OR: [
                    { ownerId: user.id },
                    {
                        members: {
                            some: {
                                userId: user.id,
                            },
                        },
                    },
                ],
            },
        });
        if (!organization) {
            organization = await this.prisma.organization.create({
                data: {
                    name: `${user.name}'s Organization`,
                    ownerId: user.id,
                },
            });
        }
        const payload = { email: user.email, sub: user.id };
        const access_token = this.jwtService.sign(payload);
        const { password: _, ...userResult } = user;
        return {
            user: userResult,
            organizationId: organization.id,
            access_token,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map