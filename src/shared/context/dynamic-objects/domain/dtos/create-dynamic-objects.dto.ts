import { OmitType } from '@nestjs/swagger';
import { DynamicObjectDto } from './dynamic-objects.dto';

export class CreateDynamicObjectDto extends OmitType(DynamicObjectDto, [
  'id',
  'createdAt',
  'updatedAt',
  'updatedById',
  'objectValueIds',
]) {}
