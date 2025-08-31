import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { VcardsModule } from './vcards/vcards.module';
import { TemplatesModule } from './templates/templates.module';
import { PlansModule } from './plans/plans.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { EnquiriesModule } from './enquiries/enquiries.module';
import { DomainsModule } from './domains/domains.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MediaModule } from './media/media.module';
import { AdminModule } from './admin/admin.module';
// import { PublicModule } from './public/public.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    VcardsModule,
    TemplatesModule,
    PlansModule,
    SubscriptionsModule,
    EnquiriesModule,
    DomainsModule,
    AnalyticsModule,
    MediaModule,
    AdminModule,
    // PublicModule,
  ],
})
export class AppModule {}