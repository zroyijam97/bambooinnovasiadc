import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.warn('⚠️  Database connection failed:', error.message);
      console.warn('📝 To set up PostgreSQL: docker run --name bamboo-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=bamboo_db -p 5432:5432 -d postgres');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;

    const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');

    return Promise.all(
      models.map((modelKey) => this[modelKey as string].deleteMany()),
    );
  }
}