import { IsEmail, IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SyncUserDto {
  @ApiProperty({ description: 'User ID from external auth provider' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User full name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Placeholder password for external auth users' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'Whether email is verified', required: false })
  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;
}