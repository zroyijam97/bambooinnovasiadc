import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { VcardsService } from './vcards.service';
import { CreateVCardDto } from './dto/create-vcard.dto';
import { UpdateVCardDto } from './dto/update-vcard.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('vcards')
@Controller('vcards')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VcardsController {
  constructor(private readonly vcardsService: VcardsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new VCard' })
  @ApiResponse({ status: 201, description: 'VCard created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Slug already exists' })
  async create(@Body() createVCardDto: CreateVCardDto, @Request() req) {
    try {
      const organizationId = req.user.organizationId;
      return await this.vcardsService.create(createVCardDto, organizationId);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('A card with this slug already exists');
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all VCards for the organization or check slug availability' })
  @ApiResponse({ status: 200, description: 'VCards retrieved successfully or slug exists' })
  @ApiResponse({ status: 404, description: 'Slug not found (available)' })
  async findAll(@Request() req, @Query('status') status?: string, @Query('slug') slug?: string) {
    const organizationId = req.user.organizationId;
    
    // If slug query parameter is provided, check slug availability
    if (slug) {
      const existingVCard = await this.vcardsService.findBySlugInOrganization(slug, organizationId);
      if (existingVCard) {
        return { available: false }; // Slug exists, return 200
      } else {
        throw new NotFoundException('Slug not found'); // Slug available, return 404
      }
    }
    
    return await this.vcardsService.findAll(organizationId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a VCard by ID' })
  @ApiResponse({ status: 200, description: 'VCard retrieved successfully' })
  @ApiResponse({ status: 404, description: 'VCard not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    const organizationId = req.user.organizationId;
    const vcard = await this.vcardsService.findOne(id, organizationId);
    if (!vcard) {
      throw new NotFoundException('VCard not found');
    }
    return vcard;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a VCard' })
  @ApiResponse({ status: 200, description: 'VCard updated successfully' })
  @ApiResponse({ status: 404, description: 'VCard not found' })
  async update(
    @Param('id') id: string,
    @Body() updateVCardDto: UpdateVCardDto,
    @Request() req,
  ) {
    const organizationId = req.user.organizationId;
    try {
      return await this.vcardsService.update(id, updateVCardDto, organizationId);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('A card with this slug already exists');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('VCard not found');
      }
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a VCard' })
  @ApiResponse({ status: 200, description: 'VCard deleted successfully' })
  @ApiResponse({ status: 404, description: 'VCard not found' })
  async remove(@Param('id') id: string, @Request() req) {
    const organizationId = req.user.organizationId;
    try {
      return await this.vcardsService.remove(id, organizationId);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('VCard not found');
      }
      throw error;
    }
  }

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish a VCard' })
  @ApiResponse({ status: 200, description: 'VCard published successfully' })
  @ApiResponse({ status: 404, description: 'VCard not found' })
  async publish(@Param('id') id: string, @Request() req) {
    const organizationId = req.user.organizationId;
    return await this.vcardsService.publish(id, organizationId);
  }
}