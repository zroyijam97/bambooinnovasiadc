import { Controller, Get, Param } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('templates')
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all templates' })
  @ApiResponse({ status: 200, description: 'Templates retrieved successfully' })
  async findAll() {
    return await this.templatesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a template by ID' })
  @ApiResponse({ status: 200, description: 'Template retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async findOne(@Param('id') id: string) {
    return await this.templatesService.findOne(id);
  }
}