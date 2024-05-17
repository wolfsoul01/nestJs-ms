import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ObjectPropertyDto } from './object-properties.dto';

export class UpdateObjectPropertyDto extends PartialType(
  OmitType(ObjectPropertyDto, ['createdAt', 'updatedAt', 'createdById'] as const),
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
