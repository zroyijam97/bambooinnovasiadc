import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnquiriesService {
  constructor(private prisma: PrismaService) {}
}