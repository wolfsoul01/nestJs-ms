import { OmitType } from '@nestjs/swagger';
import { ObjectValueDto } from './object-values.dto';

export class CreateObjectValueDto extends OmitType(ObjectValueDto, [
  'createdAt',
  'updatedAt',
  'tag',
  'listsValueIds',
  'objectValueId',
]) {}
