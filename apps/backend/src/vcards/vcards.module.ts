import { Module } from '@nestjs/common';
import { VcardsService } from './vcards.service';
import { VcardsController } from './vcards.controller';
import { PublicVcardsController } from './public-vcards.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VcardsController, PublicVcardsController],
  providers: [VcardsService],
  exports: [VcardsService],
})
export class VcardsModule {}