import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // Get user with their organization memberships
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        organizations: {
          include: {
            organization: true,
          },
        },
        ownedOrganizations: true,
      },
    });

    if (!user) {
      return null;
    }

    // Get the first organization (either owned or member of)
    let organizationId = null;
    if (user.ownedOrganizations.length > 0) {
      organizationId = user.ownedOrganizations[0].id;
    } else if (user.organizations.length > 0) {
      organizationId = user.organizations[0].organizationId;
    }

    return {
      userId: payload.sub,
      email: payload.email,
      organizationId,
    };
  }
}