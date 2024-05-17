export class TenantDto {
  id: number;
  name: string;
  description: string;
  parentId?: number;
  coverageZoneId: number;
  url: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  users?: number[];
  tenantTypes?: number[];
  children?: number[];
  roleAliases?: number[];
  recordStatusByRecordType?: number[];
  problemCodeByRecordType?: number[];
  tenantRoleAliases?: number[];
}
