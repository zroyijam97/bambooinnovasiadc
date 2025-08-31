import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('organizations')
@Controller('organizations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiResponse({ status: 201, description: 'Organization created successfully' })
  async create(@Body() createOrgDto: { name: string; logo?: string }, @Request() req) {
    const ownerId = req.user.userId;
    return this.organizationsService.create({
      ...createOrgDto,
      ownerId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all organizations for the user' })
  @ApiResponse({ status: 200, description: 'Organizations retrieved successfully' })
  async findAll(@Request() req) {
    const userId = req.user.userId;
    return this.organizationsService.findAllForUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an organization by ID' })
  @ApiResponse({ status: 200, description: 'Organization retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an organization' })
  @ApiResponse({ status: 200, description: 'Organization updated successfully' })
  async update(@Param('id') id: string, @Body() updateOrgDto: { name?: string; logo?: string }) {
    return this.organizationsService.update(id, updateOrgDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an organization' })
  @ApiResponse({ status: 200, description: 'Organization deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }
}