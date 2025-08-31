import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { VcardsService } from './vcards.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('public-vcards')
@Controller('v')
export class PublicVcardsController {
  constructor(private readonly vcardsService: VcardsService) {}

  @Get(':slug')
  @ApiOperation({ summary: 'Get a published VCard by slug (public endpoint)' })
  @ApiResponse({ status: 200, description: 'VCard retrieved successfully' })
  @ApiResponse({ status: 404, description: 'VCard not found or not published' })
  async getPublicVCard(@Param('slug') slug: string) {
    const vcard = await this.vcardsService.findBySlug(slug);
    if (!vcard) {
      throw new NotFoundException('VCard not found or not published');
    }
    return vcard;
  }
}