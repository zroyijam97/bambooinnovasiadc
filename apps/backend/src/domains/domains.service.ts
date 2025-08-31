import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DomainsService {
  constructor(private prisma: PrismaService) {}
}