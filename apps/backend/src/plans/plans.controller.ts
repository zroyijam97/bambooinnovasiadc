import { Controller } from '@nestjs/common';
import { PlansService } from './plans.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}
}