import { OmitType } from '@nestjs/swagger';
import { ObjectDefintionDto } from './object-definitions.dto';

export class CreateObjectDefinitionDto extends OmitType(ObjectDefintionDto, [
  'id',
  'createdAt',
  'objectProperties',
  'updatedAt',
  'updatedById',
]) {}
