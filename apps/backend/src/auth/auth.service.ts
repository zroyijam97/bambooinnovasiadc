import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SyncUserDto } from './dto/sync-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string, name: string) {
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

  async syncUser(syncUserDto: SyncUserDto) {
    // Check if user already exists by ID or email
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { id: syncUserDto.id },
          { email: syncUserDto.email }
        ]
      },
    });

    if (!user) {
      // Create new user with the provided ID from external auth
      user = await this.prisma.user.create({
        data: {
          id: syncUserDto.id,
          email: syncUserDto.email,
          name: syncUserDto.name,
          password: syncUserDto.password, // Placeholder for external auth
          emailVerified: syncUserDto.emailVerified || false,
        },
      });
    } else {
      // Update existing user with new information
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          name: syncUserDto.name,
          emailVerified: syncUserDto.emailVerified || user.emailVerified,
        },
      });
    }

    // Ensure user has an organization (create if doesn't exist)
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
      // Create a default organization for the user
      organization = await this.prisma.organization.create({
        data: {
          name: `${user.name}'s Organization`,
          ownerId: user.id,
        },
      });
    }



    // Generate JWT token
    const payload = { email: user.email, sub: user.id };
    const access_token = this.jwtService.sign(payload);

    const { password: _, ...userResult } = user;
    return {
      user: userResult,
      organizationId: organization.id,
      access_token,
    };
  }
}