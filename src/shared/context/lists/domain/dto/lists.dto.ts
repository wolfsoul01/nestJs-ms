import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ListDataTypeEnum, IssuerEnum } from '../../../../dataTypes/Enums';

export class ListDto {
  @ApiProperty({ type: Number, required: true })
  id: number;

  @ApiProperty({ type: 'string', required: true })
  listName: string;

  @ApiProperty({ type: 'enum', enum: IssuerEnum, required: true })
  origin: IssuerEnum;

  @ApiProperty({ type: 'boolean', required: true })
  enabled: boolean;

  @ApiProperty({ type: 'string', required: false })
  description: string;

  @ApiProperty({ type: Number, required: false })
  tenantId: number;

  @ApiProperty({ type: Number, required: true })
  dataType: ListDataTypeEnum;

  @ApiProperty({ type: Number, required: false })
  listLinkedTenants: number[];

  @ApiProperty({ type: Number, required: false })
  listLinkedUsers: number[];

  @ApiProperty({ type: Date, required: false })
  createdAt: Date;

  @ApiProperty({ type: Date, required: false })
  updatedAt: Date;
}

export class FindListsDto extends PartialType(ListDto) {
  ids?: number[];
}
