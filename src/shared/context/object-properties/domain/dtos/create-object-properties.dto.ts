import { OmitType } from '@nestjs/swagger';
import { ObjectPropertyDto } from './object-properties.dto';

export class CreateObjectPropertyDto extends OmitType(ObjectPropertyDto, [
  'id',
  'createdAt',
  'updatedAt',
  'updatedById',
] as const) {}
