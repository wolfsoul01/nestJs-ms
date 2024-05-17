import { CreatePageDto } from '../dtos/create-pages.dto';
import { fetchedObjectDefinition } from '../../../object-definitions/domain/stubs/object-definitions.stub';
import { Pages } from '@avantodev/avanto-db';

export const createPageDto: CreatePageDto = {
  name: "test's page",
  description: 'this is a page',
  objectDefinitionId: 1,
};

export const pageStub = {
  ...createPageDto,
  objectDefinition: fetchedObjectDefinition[0],
  id: 1,
} as Pages;
