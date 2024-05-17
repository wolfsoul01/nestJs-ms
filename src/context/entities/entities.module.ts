import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  DynamicObject,
  Lists,
  ListsValues,
  ObjectDefinition,
  ObjectProperty,
  ObjectValue,
  Pages,
  Tenant,
  User,
} from '@avantodev/avanto-db';
import { dbConfig } from '@avantodev/avanto-shared-resources';
import { ListsService } from 'src/shared/context/lists/domain/lists.service';
import { UsersService } from 'src/shared/context/users/domain/users.service';
import { TenantsService } from 'src/shared/context/tenants/domain/tenants.service';
import { ListsValuesService } from 'src/shared/context/list-values/lists-values';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ObjectDefinition, ObjectProperty, DynamicObject, ObjectValue, User, Tenant, ListsValues, Lists, Pages],
      dbConfig.name,
    ),
  ],
  providers: [ListsService, UsersService, TenantsService, ListsValuesService],
  exports: [
    TypeOrmModule.forFeature(
      [ObjectDefinition, ObjectProperty, DynamicObject, ObjectValue, User, Tenant, ListsValues, Lists, Pages],
      dbConfig.name,
    ),
    ListsService,
    UsersService,
    TenantsService,
    ListsValuesService,
  ],
})
export class EntitiesModule {}
