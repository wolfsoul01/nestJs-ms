import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ObjectPropertyDto } from './object-properties.dto';

export class FindObjectPropertiesDto extends PartialType(OmitType(ObjectPropertyDto, ['updatedAt', 'createdAt'])) {
  @ApiProperty({ description: 'Array of names to find object properties by', type: [String] })
  names?: string[];

  @ApiProperty({ description: 'Array of IDs to find object properties by', type: [Number] })
  ids?: number[];

  @ApiProperty({ description: 'Array of creator IDs to find object properties by', type: [Number] })
  createdByIds?: number[];

  @ApiProperty({ description: 'Array of updater IDs to find object properties by', type: [Number] })
  updatedByIds?: number[];

  @ApiProperty({ description: 'Array of data types to find object properties by', type: [String] })
  datatypes?: string[];

  listTypeIds?: number[];

  objectTypeIds?: number[];

  @ApiProperty({ description: 'Array of object definition IDs to find object properties by', type: [Number] })
  objectDefinitionIds?: number[];
}
