import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ListsValues } from '@avantodev/avanto-db';

export class ListValueDto {
  @ApiProperty({ type: Number, required: true })
  id: number;

  @ApiProperty({ type: 'Number', required: true })
  listId: number;

  @ApiProperty({ type: Number, required: false })
  listLinkedTenants: number[];

  @ApiProperty({ type: Number, required: false })
  listLinkedUsers: number[];

  @ApiProperty({ type: String, required: false })
  value: string;

  @ApiProperty({ type: Number, required: false })
  order: number;

  @ApiProperty({ type: Number, required: false })
  userValue: number;

  @ApiProperty({ required: false, default: true })
  enabled: boolean;

  @ApiProperty({ type: Number, required: true })
  tenant: number;
}

export class FindListsValuesDto extends PartialType(OmitType(ListsValues, ['createdAt', 'updatedAt'])) {
  ids: number[];

  @ApiProperty({ type: [Number], isArray: true, required: false })
  listIds: number[];
}
