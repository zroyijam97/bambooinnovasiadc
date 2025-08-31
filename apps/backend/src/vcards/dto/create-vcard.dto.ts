import { IsString, IsOptional, IsEmail, IsUrl, IsEnum, IsObject, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBusinessHoursDto {
  @ApiProperty({ enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] })
  @IsEnum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'])
  day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  openTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  closeTime?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isClosed?: boolean;
}

export class CreateServiceDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty()
  order: number;
}

export class CreateSocialLinkDto {
  @ApiProperty()
  @IsString()
  platform: string;

  @ApiProperty()
  @IsUrl()
  url: string;

  @ApiProperty()
  order: number;
}

export class CreateTestimonialDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  rating: number;

  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  order: number;
}

export class CreateVCardDto {
  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  templateId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  banner?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  themeConfig?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fontId?: string;

  @ApiPropertyOptional({ enum: ['DRAFT', 'PUBLISHED'], default: 'DRAFT' })
  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED'])
  publishStatus?: 'DRAFT' | 'PUBLISHED';

  @ApiPropertyOptional({ type: [CreateBusinessHoursDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBusinessHoursDto)
  businessHours?: CreateBusinessHoursDto[];

  @ApiPropertyOptional({ type: [CreateServiceDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceDto)
  services?: CreateServiceDto[];

  @ApiPropertyOptional({ type: [CreateSocialLinkDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSocialLinkDto)
  socialLinks?: CreateSocialLinkDto[];

  @ApiPropertyOptional({ type: [CreateTestimonialDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTestimonialDto)
  testimonials?: CreateTestimonialDto[];
}