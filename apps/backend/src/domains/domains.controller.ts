import { Controller } from '@nestjs/common';
import { DomainsService } from './domains.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('domains')
@Controller('domains')
export class DomainsController {
  constructor(private readonly domainsService: DomainsService) {}
}