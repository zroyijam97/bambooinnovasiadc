import { PartialType } from '@nestjs/swagger';
import { CreateVCardDto } from './create-vcard.dto';

export class UpdateVCardDto extends PartialType(CreateVCardDto) {}