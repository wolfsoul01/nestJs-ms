import { findOneUserResult } from '../../../../../shared/context/users/domain/stubs/users.stubs';
import { CreateDynamicObjectDto } from '../dtos/create-dynamic-objects.dto';
import { DynamicObject } from '@avantodev/avanto-db';
import { fetchedObjectDefinition } from '../../../../../shared/context/object-definitions/domain/stubs/object-definitions.stub';
import { tenantStub } from '../../../../../shared/context/tenants/domain/stubs/tenants.stub';

export const createDynamicObjectDto: CreateDynamicObjectDto = {
  createdById: 78,
  enabled: true,
  objectDefinitionId: 1,
  tenantId: 1,
};

export const dynamicObjectStub: DynamicObject = {
  ...createDynamicObjectDto,
  createdAt: new Date(),
  createdBy: findOneUserResult,
  id: 1,
  objectDefinition: fetchedObjectDefinition[0],
  tenant: tenantStub,
  updatedAt: new Date(),
  updatedBy: findOneUserResult,
  objectValues: null,
};
