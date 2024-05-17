import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ObjectDefintionDto } from './object-definitions.dto';

export class UpdateObjectDefinitionDto extends PartialType(
  OmitType(ObjectDefintionDto, ['createdAt', 'updatedAt', 'createdById', 'objectProperties']),
) {
  @ApiProperty({
    required: true,
    description: 'The unique identifier of the object definition to be updated',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'The unique identifier of the user who is updating the object definition',
    example: 1,
    type: Number,
  })
  updatedById: number;
}
