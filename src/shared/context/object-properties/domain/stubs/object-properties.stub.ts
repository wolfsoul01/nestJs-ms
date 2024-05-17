import { findOneUserResult } from '../../../../../shared/context/users/domain/stubs/users.stubs';
import { CreateObjectPropertyDto } from '../dtos/create-object-properties.dto';
import { fetchedObjectDefinition } from '../../../../../shared/context/object-definitions/domain/stubs/object-definitions.stub';
import { ObjectProperty } from '@avantodev/avanto-db';

export const createObjectPropertyStringDto: CreateObjectPropertyDto = {
  createdById: 78,
  dataType: 'string',
  description: 'Test property',
  enabled: true,
  isDisplayable: true,
  isRequired: true,
  name: 'Test property',
  objectDefinitionId: 1,
  order: 9,
  objectTypeId: null,
};

export const objectPropertyStub = {
  ...createObjectPropertyStringDto,
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: findOneUserResult,
  updatedBy: findOneUserResult,
  objectDefinition: fetchedObjectDefinition[0],
  listType: null,
  objectType: null,
} as ObjectProperty;
