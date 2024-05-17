import { Tenant } from '@avantodev/avanto-db';

export const tenantStub: Tenant = JSON.parse(`{
    "id": 1,
    "name": "Hartford Office Interiors",
    "description": "Testing purposes in Orderbahn",
    "url": "hoi",
    "apiKey": "SrzczBcbeIhLsT3QQcEBtfhzQWeqo9lmn4K-TI1rHs",
    "apiSecret": "a9VBUUykzIpl0AMWV0YlZpxsNzOzRkqFMXw6-H1VxaRuEPPy1VPSqflyLDWrsFWJS2MjkU4-XWFzzQYgTlRTP2gxfL9ksqljUGZfrOfZz-JVFs4X",
    "enabled": true,
    "createdAt": "2022-08-09T17:37:42.597Z",
    "updatedAt": "2023-07-12T14:27:45.746Z",
    "tenantType": [
      {
        "id": 3,
        "name": "Installer",
        "description": "Installer",
        "tag": "Installer",
        "enabled": true,
        "createdAt": "2022-08-09T17:31:09.317Z",
        "updatedAt": "2023-07-12T13:46:56.821Z"
      },
      {
        "id": 2,
        "name": "Dealer",
        "description": "Dealer",
        "tag": "Dealer",
        "enabled": true,
        "createdAt": "2022-08-09T17:30:58.113Z",
        "updatedAt": "2023-07-12T13:46:56.807Z"
      },
      {
        "id": 1,
        "name": "Factory",
        "description": "Factory",
        "tag": "Factor",
        "enabled": true,
        "createdAt": "2022-08-09T17:30:35.293Z",
        "updatedAt": "2023-07-26T22:06:09.273Z"
      }
    ],
    "children": [],
    "parent": null,
    "coverageZone": {
      "id": 1,
      "name": "Default",
      "description": "Default coverage zone",
      "enabled": true,
      "createdAt": "2022-08-09T17:32:49.160Z",
      "updatedAt": "2023-04-27T20:24:18.207Z"
    },
    "users": [
      {
        "id": 78,
        "firstName": "Michael ",
        "lastName": "Shinn",
        "email": "agnes_runt10@yahoo.com",
        "fireBaseId": "default",
        "enabled": true,
        "validated": true,
        "BackOfficeAccess": true,
        "SaasAccess": true,
        "avatar": null,
        "phone": null,
        "temporalId": null,
        "createdAt": "2022-11-17T21:02:41.375Z",
        "verifiedAt": "2023-06-19T22:25:56.822Z",
        "updatedAt": "2023-07-03T16:18:50.978Z"
      },
      {
        "id": 79,
        "firstName": "Billy Jean",
        "lastName": "Taylor B",
        "email": "larry.schu8@yahoo.com",
        "fireBaseId": "fb3b6e83-b01c-4d0a-8b6a-231b88741ac1",
        "enabled": false,
        "validated": false,
        "BackOfficeAccess": false,
        "SaasAccess": false,
        "avatar": null,
        "phone": null,
        "temporalId": null,
        "createdAt": "2022-08-19T17:33:29.928Z",
        "verifiedAt": "2023-06-19T22:25:56.822Z",
        "updatedAt": "2024-02-29T18:58:27.357Z"
      }
    ]
  }`) as Tenant;
