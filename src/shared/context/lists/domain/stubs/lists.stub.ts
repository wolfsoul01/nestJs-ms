import { Lists } from '@avantodev/avanto-db';

export const fetchedLists: Lists[] = JSON.parse(`[
    {
      "id": 1,
      "listName": "227 testing the lists with juancho",
      "origin": "BackOffice",
      "enabled": true,
      "dataType": "Value",
      "description": "",
      "isDefault": true,
      "createdAt": "2024-02-10T21:36:07.976Z",
      "updatedAt": "2024-02-27T13:52:06.938Z",
      "tenant": null,
      "listValues": [
        {
          "id": 58,
          "value": "Test QA",
          "enabled": true,
          "order": -1,
          "createdAt": "2024-02-15T19:43:32.323Z",
          "updatedAt": "2024-02-15T19:43:32.323Z"
        },
        {
          "id": 61,
          "value": "Test QA",
          "enabled": true,
          "order": -1,
          "createdAt": "2024-02-15T19:57:58.726Z",
          "updatedAt": "2024-02-15T19:57:58.726Z"
        },
        {
          "id": 56,
          "value": "(Edited pre review) hola hola juanchis probando",
          "enabled": true,
          "order": 56,
          "createdAt": "2024-02-15T00:21:30.418Z",
          "updatedAt": "2024-02-16T20:11:20.335Z"
        },
        {
          "id": 62,
          "value": "(Created pre review) Value 2",
          "enabled": true,
          "order": 1,
          "createdAt": "2024-02-16T20:12:25.727Z",
          "updatedAt": "2024-02-16T20:12:25.727Z"
        },
        {
          "id": 16,
          "value": "test",
          "enabled": true,
          "order": 33,
          "createdAt": "2024-02-13T02:28:05.954Z",
          "updatedAt": "2024-02-13T02:28:05.954Z"
        },
        {
          "id": 35,
          "value": "Value 222",
          "enabled": true,
          "order": 35,
          "createdAt": "2024-02-13T22:05:16.308Z",
          "updatedAt": "2024-02-27T18:46:20.362Z"
        },
        {
          "id": 32,
          "value": "test list value qa",
          "enabled": true,
          "order": 31,
          "createdAt": "2024-02-13T21:55:40.479Z",
          "updatedAt": "2024-02-13T21:55:40.479Z"
        },
        {
          "id": 34,
          "value": "value 1",
          "enabled": true,
          "order": 1,
          "createdAt": "2024-02-13T22:04:01.033Z",
          "updatedAt": "2024-02-13T22:04:01.033Z"
        },
        {
          "id": 17,
          "value": "test",
          "enabled": false,
          "order": 33,
          "createdAt": "2024-02-13T02:29:56.482Z",
          "updatedAt": "2024-03-08T20:00:23.422Z"
        },
        {
          "id": 57,
          "value": "updated from graphql",
          "enabled": false,
          "order": 23,
          "createdAt": "2024-02-15T00:23:42.853Z",
          "updatedAt": "2024-03-08T20:00:25.683Z"
        },
        {
          "id": 4,
          "value": "(Edit) hola juanchilas probando el update para la documentacion",
          "enabled": false,
          "order": 48,
          "createdAt": "2024-02-10T21:59:41.701Z",
          "updatedAt": "2024-02-14T21:53:46.224Z"
        },
        {
          "id": 59,
          "value": "Test QA",
          "enabled": true,
          "order": -1,
          "createdAt": "2024-02-15T19:45:02.475Z",
          "updatedAt": "2024-03-08T22:43:20.426Z"
        },
        {
          "id": 232,
          "value": "test",
          "enabled": true,
          "order": 1,
          "createdAt": "2024-03-08T21:42:35.333Z",
          "updatedAt": "2024-03-08T21:42:35.333Z"
        },
        {
          "id": 233,
          "value": "March 8th ",
          "enabled": true,
          "order": 1,
          "createdAt": "2024-03-08T22:14:30.251Z",
          "updatedAt": "2024-03-08T22:31:17.114Z"
        }
      ]
    },
    {
      "id": 3,
      "listName": "testing the lists with juancho",
      "origin": "Saas",
      "enabled": true,
      "dataType": "Value",
      "description": "",
      "isDefault": true,
      "createdAt": "2024-02-10T22:08:58.694Z",
      "updatedAt": "2024-02-10T22:08:58.694Z",
      "tenant": null,
      "listValues": [
        {
          "id": 25,
          "value": "test",
          "enabled": false,
          "order": 4,
          "createdAt": "2024-02-13T02:45:27.654Z",
          "updatedAt": "2024-03-11T17:08:22.527Z"
        },
        {
          "id": 26,
          "value": "test",
          "enabled": true,
          "order": 5,
          "createdAt": "2024-02-13T02:48:04.498Z",
          "updatedAt": "2024-03-11T17:08:23.501Z"
        },
        {
          "id": 28,
          "value": "last test in qa from listvalue",
          "enabled": true,
          "order": 33,
          "createdAt": "2024-02-13T18:09:48.527Z",
          "updatedAt": "2024-03-11T18:04:45.386Z"
        },
        {
          "id": 27,
          "value": "list value test from graphql",
          "enabled": false,
          "order": 1,
          "createdAt": "2024-02-13T02:48:41.832Z",
          "updatedAt": "2024-03-11T18:04:45.838Z"
        },
        {
          "id": 23,
          "value": "test",
          "enabled": true,
          "order": 2,
          "createdAt": "2024-02-13T02:40:29.863Z",
          "updatedAt": "2024-03-11T18:04:46.376Z"
        },
        {
          "id": 24,
          "value": "test",
          "enabled": true,
          "order": 3,
          "createdAt": "2024-02-13T02:45:04.981Z",
          "updatedAt": "2024-03-11T17:08:21.371Z"
        }
      ]
    },
    {
      "id": 13,
      "listName": "List to test juancho from graphql praaaa",
      "origin": "BackOffice",
      "enabled": true,
      "dataType": "Value",
      "description": "",
      "isDefault": true,
      "createdAt": "2024-02-11T22:40:00.528Z",
      "updatedAt": "2024-02-11T22:40:00.528Z",
      "tenant": null,
      "listValues": [
        {
          "id": 10,
          "value": "hola value",
          "enabled": false,
          "order": 31,
          "createdAt": "2024-02-12T19:51:56.955Z",
          "updatedAt": "2024-02-12T19:51:56.955Z"
        },
        {
          "id": 11,
          "value": "hola value",
          "enabled": false,
          "order": 31,
          "createdAt": "2024-02-12T19:55:40.227Z",
          "updatedAt": "2024-02-12T19:55:40.227Z"
        },
        {
          "id": 12,
          "value": "hola value nuevamente",
          "enabled": false,
          "order": 31,
          "createdAt": "2024-02-12T19:56:43.495Z",
          "updatedAt": "2024-02-12T19:56:43.495Z"
        },
        {
          "id": 13,
          "value": "hola value nuevamente",
          "enabled": false,
          "order": 31,
          "createdAt": "2024-02-12T19:57:10.790Z",
          "updatedAt": "2024-02-12T19:57:10.790Z"
        },
        {
          "id": 14,
          "value": "hola value nuevamente",
          "enabled": true,
          "order": 31,
          "createdAt": "2024-02-12T19:57:34.366Z",
          "updatedAt": "2024-02-12T19:57:34.366Z"
        },
        {
          "id": 15,
          "value": "hola value nuevamente",
          "enabled": true,
          "order": 31,
          "createdAt": "2024-02-12T20:03:37.758Z",
          "updatedAt": "2024-02-12T20:03:37.758Z"
        },
        {
          "id": 42,
          "value": "hola testing listLinkedTenants to value",
          "enabled": true,
          "order": 41,
          "createdAt": "2024-02-14T14:25:48.200Z",
          "updatedAt": "2024-02-14T14:25:48.200Z"
        },
        {
          "id": 43,
          "value": "juan probando desde la UI.",
          "enabled": true,
          "order": 1,
          "createdAt": "2024-02-14T14:32:19.880Z",
          "updatedAt": "2024-02-14T14:32:48.582Z"
        },
        {
          "id": 44,
          "value": "test",
          "enabled": true,
          "order": 1,
          "createdAt": "2024-02-14T14:48:36.757Z",
          "updatedAt": "2024-02-14T14:48:36.757Z"
        },
        {
          "id": 46,
          "value": "hola testing listLinkedTenants to value from graphql and  qa",
          "enabled": false,
          "order": 41,
          "createdAt": "2024-02-14T14:54:41.245Z",
          "updatedAt": "2024-02-14T14:54:41.245Z"
        },
        {
          "id": 48,
          "value": "other value without enabled...",
          "enabled": true,
          "order": 41,
          "createdAt": "2024-02-14T14:57:23.809Z",
          "updatedAt": "2024-02-14T14:57:23.809Z"
        },
        {
          "id": 49,
          "value": "other value without enabled...",
          "enabled": false,
          "order": 41,
          "createdAt": "2024-02-14T15:01:32.604Z",
          "updatedAt": "2024-02-14T15:01:32.604Z"
        },
        {
          "id": 50,
          "value": "Hola by Leo",
          "enabled": true,
          "order": -1,
          "createdAt": "2024-02-14T19:15:40.448Z",
          "updatedAt": "2024-02-14T19:15:40.448Z"
        },
        {
          "id": 52,
          "value": "Hola by Leo",
          "enabled": true,
          "order": -1,
          "createdAt": "2024-02-14T19:16:28.170Z",
          "updatedAt": "2024-02-14T19:16:28.170Z"
        },
        {
          "id": 7,
          "value": "(Edited) hola value",
          "enabled": false,
          "order": 7,
          "createdAt": "2024-02-11T22:51:11.350Z",
          "updatedAt": "2024-02-14T21:07:20.296Z"
        },
        {
          "id": 51,
          "value": "Hola by Leo",
          "enabled": true,
          "order": -1,
          "createdAt": "2024-02-14T19:16:02.104Z",
          "updatedAt": "2024-02-14T22:11:28.167Z"
        },
        {
          "id": 55,
          "value": "Hola by Leo",
          "enabled": true,
          "order": -1,
          "createdAt": "2024-02-14T23:28:47.366Z",
          "updatedAt": "2024-02-14T23:28:47.366Z"
        },
        {
          "id": 47,
          "value": "other value without enabled...",
          "enabled": false,
          "order": 41,
          "createdAt": "2024-02-14T14:55:01.574Z",
          "updatedAt": "2024-02-15T00:18:03.264Z"
        },
        {
          "id": 45,
          "value": "hola testing listLinkedTenants to value from graphql and  qa",
          "enabled": true,
          "order": 41,
          "createdAt": "2024-02-14T14:53:24.393Z",
          "updatedAt": "2024-03-08T21:52:59.656Z"
        }
      ]
    }
  ]`) as Lists[];
