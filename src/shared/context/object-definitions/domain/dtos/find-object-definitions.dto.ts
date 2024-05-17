import { ObjectDefintionDto } from './object-definitions.dto';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class FindObjectDefinitionDto extends PartialType(OmitType(ObjectDefintionDto, ['createdAt', 'updatedAt'])) {
  //find by plural properties
  @ApiProperty({ description: 'Array of names to find object definitions by', type: [String] })
  names?: string[];

  @ApiProperty({ description: 'Array of IDs to find object definitions by', type: [Number] })
  ids?: number[];

  @ApiProperty({ description: 'Array of creator IDs to find object definitions by', type: [Number] })
  createdByIds?: number[];

  @ApiProperty({ description: 'Array of updater IDs to find object definitions by', type: [Number] })
  updatedByIds?: number[];
}
