import { CreateObjectDefinitionDto } from '../dtos/create-object-definitions.dto';
import { ObjectDefinition } from '@avantodev/avanto-db';
import { UpdateObjectDefinitionDto } from '../dtos/update-object-definitions.dto';

export const createObjectDefinitionDto = {
  createdById: 78,
  enabled: true,
  name: 'Test List',
  description: 'Test description',
} as CreateObjectDefinitionDto;

export const fetchedObjectDefinition: ObjectDefinition[] = JSON.parse(`[
  {
      "id": 1,
      "name": "Rustic Small",
      "description": "Qui laboriosam dolores incidunt.",
      "enabled": false,
      "createdAt": "2024-03-10T04:29:17.390Z",
      "updatedAt": "2024-03-10T04:29:17.390Z",
      "createdBy": {
          "id": 78,
          "firstName": "Test",
          "lastName": "Test",
          "email": "tenar85623@raotus.com",
          "fireBaseId": "fec07ad1-788b-4cb0-b057-21d8f5996610",
          "enabled": true,
          "validated": true,
          "BackOfficeAccess": true,
          "SaasAccess": true,
          "avatar": null,
          "phone": null,
          "temporalId": null,
          "createdAt": "2023-05-05T20:31:00.883Z",
          "verifiedAt": "2023-06-13T01:25:51.697Z",
          "updatedAt": "2023-09-07T07:32:34.298Z"
      },
      "updatedBy": {
          "id": 78,
          "firstName": "Test",
          "lastName": "Test",
          "email": "tenar85623@raotus.com",
          "fireBaseId": "fec07ad1-788b-4cb0-b057-21d8f5996610",
          "enabled": true,
          "validated": true,
          "BackOfficeAccess": true,
          "SaasAccess": true,
          "avatar": null,
          "phone": null,
          "temporalId": null,
          "createdAt": "2023-05-05T20:31:00.883Z",
          "verifiedAt": "2023-06-13T01:25:51.697Z",
          "updatedAt": "2023-09-07T07:32:34.298Z"
      }
  },
  {
      "id": 2,
      "name": "Fresh Granite Movies Florida",
      "description": "Et et architecto qui nesciunt et.",
      "enabled": true,
      "createdAt": "2024-03-10T04:42:42.390Z",
      "updatedAt": "2024-03-10T04:42:42.390Z",
      "createdBy": {
          "id": 79,
          "firstName": "Test",
          "lastName": "Last",
          "email": "testa3@gmail.com",
          "fireBaseId": "77dcec0e-cc38-47fd-9e94-3666ca07f2d6",
          "enabled": false,
          "validated": false,
          "BackOfficeAccess": false,
          "SaasAccess": true,
          "avatar": null,
          "phone": null,
          "temporalId": null,
          "createdAt": "2023-06-05T22:30:38.138Z",
          "verifiedAt": "2023-06-13T01:25:51.697Z",
          "updatedAt": "2023-06-05T22:30:38.138Z"
      },
      "updatedBy": {
          "id": 79,
          "firstName": "Test",
          "lastName": "Last",
          "email": "testa3@gmail.com",
          "fireBaseId": "77dcec0e-cc38-47fd-9e94-3666ca07f2d6",
          "enabled": false,
          "validated": false,
          "BackOfficeAccess": false,
          "SaasAccess": true,
          "avatar": null,
          "phone": null,
          "temporalId": null,
          "createdAt": "2023-06-05T22:30:38.138Z",
          "verifiedAt": "2023-06-13T01:25:51.697Z",
          "updatedAt": "2023-06-05T22:30:38.138Z"
      }
  },
  {
      "id": 3,
      "name": "backing indexing Industrial Organized",
      "description": "Aliquam vitae autem voluptatem et impedit aliquam.",
      "enabled": true,
      "createdAt": "2024-03-10T04:42:45.111Z",
      "updatedAt": "2024-03-10T04:42:45.111Z",
      "createdBy": {
          "id": 79,
          "firstName": "Test",
          "lastName": "Last",
          "email": "testa3@gmail.com",
          "fireBaseId": "77dcec0e-cc38-47fd-9e94-3666ca07f2d6",
          "enabled": false,
          "validated": false,
          "BackOfficeAccess": false,
          "SaasAccess": true,
          "avatar": null,
          "phone": null,
          "temporalId": null,
          "createdAt": "2023-06-05T22:30:38.138Z",
          "verifiedAt": "2023-06-13T01:25:51.697Z",
          "updatedAt": "2023-06-05T22:30:38.138Z"
      },
      "updatedBy": {
          "id": 79,
          "firstName": "Test",
          "lastName": "Last",
          "email": "testa3@gmail.com",
          "fireBaseId": "77dcec0e-cc38-47fd-9e94-3666ca07f2d6",
          "enabled": false,
          "validated": false,
          "BackOfficeAccess": false,
          "SaasAccess": true,
          "avatar": null,
          "phone": null,
          "temporalId": null,
          "createdAt": "2023-06-05T22:30:38.138Z",
          "verifiedAt": "2023-06-13T01:25:51.697Z",
          "updatedAt": "2023-06-05T22:30:38.138Z"
      }
  },
  {
      "id": 4,
      "name": "Multi-lateral Utah parsing copy seamless",
      "description": "Aspernatur reprehenderit quo reiciendis consequatur aut voluptatem.",
      "enabled": false,
      "createdAt": "2024-03-10T04:42:46.339Z",
      "updatedAt": "2024-03-10T04:42:46.339Z",
      "createdBy": {
          "id": 79,
          "firstName": "Test",
          "lastName": "Last",
          "email": "testa3@gmail.com",
          "fireBaseId": "77dcec0e-cc38-47fd-9e94-3666ca07f2d6",
          "enabled": false,
          "validated": false,
          "BackOfficeAccess": false,
          "SaasAccess": true,
          "avatar": null,
          "phone": null,
          "temporalId": null,
          "createdAt": "2023-06-05T22:30:38.138Z",
          "verifiedAt": "2023-06-13T01:25:51.697Z",
          "updatedAt": "2023-06-05T22:30:38.138Z"
      },
      "updatedBy": {
          "id": 79,
          "firstName": "Test",
          "lastName": "Last",
          "email": "testa3@gmail.com",
          "fireBaseId": "77dcec0e-cc38-47fd-9e94-3666ca07f2d6",
          "enabled": false,
          "validated": false,
          "BackOfficeAccess": false,
          "SaasAccess": true,
          "avatar": null,
          "phone": null,
          "temporalId": null,
          "createdAt": "2023-06-05T22:30:38.138Z",
          "verifiedAt": "2023-06-13T01:25:51.697Z",
          "updatedAt": "2023-06-05T22:30:38.138Z"
      }
  }
]`);

export const updateObjectDefinitionDto = {
  id: 1,
  updatedById: 78,
  enabled: true,
  name: 'Test List',
  description: 'Test description',
} as UpdateObjectDefinitionDto;
