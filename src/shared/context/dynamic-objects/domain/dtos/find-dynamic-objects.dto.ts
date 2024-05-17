import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { DynamicObjectDto } from './dynamic-objects.dto';

export class FindDynamicObjectsDto extends PartialType(OmitType(DynamicObjectDto, ['createdAt', 'updatedAt'])) {
  @ApiProperty({ description: 'Array of IDs to find dynamic objects by', type: [Number] })
  ids?: number[];

  @ApiProperty({ description: 'Array of object definition IDs to find dynamic objects by', type: [Number] })
  objectDefinitionIds?: number[];

  @ApiProperty({ description: 'Array of tenant IDs to find dynamic objects by', type: [Number] })
  tenantIds?: number[];

  @ApiProperty({ description: 'Array of creator IDs to find dynamic objects by', type: [Number] })
  createdByIds?: number[];

  @ApiProperty({ description: 'Array of updater IDs to find dynamic objects by', type: [Number] })
  updatedByIds?: number[];
}
