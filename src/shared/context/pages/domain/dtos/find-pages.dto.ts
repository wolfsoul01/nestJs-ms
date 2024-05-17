import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { PageDto } from './pages.dto';

export class FindPageDto extends PartialType(OmitType(PageDto, ['description'])) {
  @ApiProperty({ description: 'Array of names to find page by', type: [String] })
  names?: string[];

  @ApiProperty({ description: 'Array of IDs to find page by', type: [Number] })
  ids?: number[];

  @ApiProperty({ description: 'Array of object definition IDs to find page by', type: [Number] })
  objectDefinitionIds?: number[];
}
