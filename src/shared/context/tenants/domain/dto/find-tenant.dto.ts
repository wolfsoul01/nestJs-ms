import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { TenantDto } from './tenant.dto';

export class FindTenantDto extends PartialType(TenantDto) {
  @ApiProperty({ nullable: true })
  id?: number;

  @ApiProperty({ nullable: true, type: [Number] })
  ids?: number[];

  @ApiProperty({ nullable: true })
  name?: string;

  @ApiProperty({ nullable: true })
  description?: string;

  @ApiProperty({ nullable: true, type: [Number] })
  parents?: number[];

  @ApiProperty({ nullable: true })
  coverageZoneId?: number;

  @ApiProperty({ nullable: true })
  url?: string;

  @ApiProperty()
  enabled?: boolean;

  @ApiProperty({ nullable: true, type: [Number] })
  users?: number[];

  @ApiProperty({ nullable: true, type: [Number] })
  tenantTypes?: number[];

  @ApiProperty({ nullable: true, type: [Number] })
  children?: number[];

  @ApiProperty({ nullable: true, type: [Number] })
  roleAliases?: number[];

  @ApiProperty({ nullable: true, type: [Number] })
  recordStatusByRecordType?: number[];

  @ApiProperty({ nullable: true, type: [Number] })
  problemCodeByRecordType?: number[];

  @ApiProperty({ nullable: true, type: [Number] })
  tenantRoleAliases?: number[];
}
