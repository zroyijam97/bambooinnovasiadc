import { Controller } from '@nestjs/common';
import { EnquiriesService } from './enquiries.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('enquiries')
@Controller('enquiries')
export class EnquiriesController {
  constructor(private readonly enquiriesService: EnquiriesService) {}
}