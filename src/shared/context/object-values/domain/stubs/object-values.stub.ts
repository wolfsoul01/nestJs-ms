import { ObjectValue } from '@avantodev/avanto-db';
import { dynamicObjectStub } from '../../../../../shared/context/dynamic-objects/domain/stubs/dynamic-objects.stub';
import { objectPropertyStub } from '../../../object-properties/domain/stubs/object-properties.stub';
import { CreateObjectValueDto } from '../dtos/create-object-values.dto';

export const objectValueDto: CreateObjectValueDto = {
  belongsToObjectId: 1,
  objectPropertyId: 1,
  value: `Test value`,
};

export const objectValuesStub: ObjectValue = {
  ...objectValueDto,
  belongsToObject: dynamicObjectStub,
  createdAt: new Date(),
  listsValues: null,
  objectProperty: objectPropertyStub,
  objectValue: null,
  tag: `1;1;1`,
  updatedAt: new Date(),
};

export const mappedObjectValueStub: Omit<
  ObjectValue,
  'tag' | 'belongsToObject' | 'createdAt' | 'updatedAt' | 'objectDefinition' | 'objectProperty'
> = {
  listsValues: null,
  objectValue: null,
  value: `Test value`,
};
