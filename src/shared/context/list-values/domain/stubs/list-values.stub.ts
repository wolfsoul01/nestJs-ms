import { ListsValues } from '@avantodev/avanto-db';

export const listValueStub: ListsValues = JSON.parse(`{
    "id": 250,
    "value": "user:94",
    "enabled": true,
    "order": 3,
    "createdAt": "2024-03-11T15:28:48.476Z",
    "updatedAt": "2024-03-14T23:52:55.510Z",
    "listId": {
      "id": 73,
      "listName": "Sales people directory",
      "origin": "Saas",
      "enabled": true,
      "dataType": "User",
      "description": "Sales people list",
      "isDefault": false,
      "createdAt": "2024-03-07T14:00:08.417Z",
      "updatedAt": "2024-03-07T14:00:08.417Z"
    },
    "linkedTenant": [
      {
        "id": 24,
        "name": "Tangram Interiors",
        "description": "Tangram Interiors Staging",
        "url": "tangram",
        "apiKey": "4f2d7e0b9c8a3f1d5e6b7c8a9d0e2f3",
        "apiSecret": "9a1c3e7b0d8f5c4e2b6a0d9f8c1e3d7",
        "enabled": true,
        "createdAt": "2023-08-15T16:32:01.717Z",
        "updatedAt": "2023-08-15T16:32:01.717Z"
      }
    ],
    "linkedUser": [],
    "userValue": {
      "id": 94,
      "firstName": "Carlos",
      "lastName": "Cedeno",
      "email": "carlos.cedeno@agiledreamteam.com",
      "fireBaseId": "812be500-00a1-7028-d877-ad95a30b2a0a",
      "enabled": true,
      "validated": true,
      "BackOfficeAccess": false,
      "SaasAccess": true,
      "avatar": null,
      "phone": null,
      "temporalId": "bf4c643b-c986-40ba-894e-51963391621b",
      "createdAt": "2023-07-12T22:16:50.623Z",
      "verifiedAt": "2023-07-12T22:16:50.623Z",
      "updatedAt": "2023-08-04T17:53:18.966Z"
    }
  },`) as ListsValues;
