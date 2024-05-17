import { BadRequestException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DynamicObjectsService } from '../dynamic-objects/dynamic-objects.service';
import { ObjectDefinitionsService } from '../object-definitions/object-definitions.service';
import { DynamicObject, ObjectValue } from '@avantodev/avanto-db';
import { InjectEntityManager } from '@nestjs/typeorm';
import { dbConfig } from '@avantodev/avanto-shared-resources';
import { EntityManager } from 'typeorm';
import { UsersService } from '../users/domain/users.service';
import { TenantsService } from '../tenants/domain/tenants.service';
import { ObjectValuesMapper } from '../object-values/domain/mappers/object-values.mapper';
import { DynamicObjectsWithValuesDto } from './domin/dtos/dynamic-objects-with-values.dto';

@Injectable()
export class DynamicObjectsWithValuesService {
  private readonly logger = new Logger(DynamicObjectsWithValuesService.name);

  constructor(
    @Inject(DynamicObjectsService)
    private readonly dynamicObjectsService: DynamicObjectsService,

    @Inject(ObjectDefinitionsService)
    private readonly objectDefinitionsService: ObjectDefinitionsService,

    @Inject(UsersService)
    private readonly usersService: UsersService,

    @Inject(TenantsService)
    private readonly tenantsService: TenantsService,

    @Inject(ObjectValuesMapper)
    private readonly objectValuesMapper: ObjectValuesMapper,

    @InjectEntityManager(dbConfig.name) private readonly manager: EntityManager,
  ) {}

  async createOrUpdateDynamicObject(payload: DynamicObjectsWithValuesDto) {
    const { objectDefinitionId, userId, tenantId, id, values } = payload;

    const foundUser = await this.usersService.findOne(userId);
    this.logger.debug(`Found updated by user with ID: ${userId}`);

    if (!foundUser) {
      this.logger.error(`Updated by user not found with ID: ${userId}`);
      throw new NotFoundException(`Not found updated by user with id ${userId}`);
    }

    const foundTenant = await this.tenantsService.findOne(tenantId);
    this.logger.debug(`Found tenant with ID: ${tenantId}`);

    if (!foundTenant) {
      this.logger.error(`Tenant not found with ID: ${tenantId}`);
      throw new NotFoundException(`Not found tenant with id ${tenantId}`);
    }

    const foundObjectDefinition = await this.objectDefinitionsService.findOne(objectDefinitionId);
    this.logger.debug(`Found object definition with ID: ${objectDefinitionId}`);

    if (!foundObjectDefinition) {
      this.logger.error(`Object definition not found with ID: ${objectDefinitionId}`);
      throw new NotFoundException(`Not found object definition with id ${objectDefinitionId}`);
    }

    return this.manager.transaction(async (entityManager) => {
      let dyanamicObject: DynamicObject;

      if (id != null) {
        dyanamicObject = await entityManager
          .getRepository(DynamicObject)
          .findOne({ where: { id }, relations: ['objectValues'] });

        if (!dyanamicObject) {
          throw new NotFoundException(`Object to update does not exists with id ${id}`);
        }

        dyanamicObject.updatedBy = foundUser;
      } else {
        dyanamicObject = entityManager.getRepository(DynamicObject).create();

        dyanamicObject.createdBy = foundUser;
        dyanamicObject.updatedBy = foundUser;
      }

      const dynamicObjectSaved = await entityManager
        .getRepository(DynamicObject)
        .save({ ...dyanamicObject, enabled: true, objectDefinition: foundObjectDefinition, tenant: foundTenant });

      const propertiesOfObject = foundObjectDefinition.objectProperties.map((o) => o.id);

      const valuesToSave: ObjectValue[] = [];

      for (const val of values) {
        if (propertiesOfObject.includes(val.propertyId)) {
          const objectProperty = foundObjectDefinition.objectProperties.find((prop) => prop.id === val.propertyId);
          const valueMapped = await this.objectValuesMapper.mapObjectValueWithDatatype({
            objectProperty,
            value: val.value,
          });

          valuesToSave.push({
            ...valueMapped,
            tag: `${foundObjectDefinition.id};${val.propertyId};${dynamicObjectSaved.id}`,
            belongsToObject: dynamicObjectSaved,
            objectProperty,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      const valuesToRemove = [];
      const filteredValuesToSave = valuesToSave.filter((val) => {
        const isEmpty = val.value?.trim() === '';
        if (isEmpty) {
          valuesToRemove.push(val);
          return false;
        }
        return true;
      });
      valuesToSave.length = 0; // Clear the array
      valuesToSave.push(...filteredValuesToSave); // Re-populate with filtered values

      const toRemove = valuesToRemove.map((v) => v.tag);
      if (toRemove && toRemove.length) await entityManager.getRepository(ObjectValue).delete(toRemove);

      await entityManager.getRepository(ObjectValue).save(valuesToSave);

      const dynamicObject = await entityManager.getRepository(DynamicObject).findOne({
        where: { id: dynamicObjectSaved.id },
        relations: ['objectValues', 'objectValues.objectProperty', 'objectValues.listsValues'],
      });

      const missingMandatoryProps = foundObjectDefinition.objectProperties.filter((op) => {
        return (
          op.isRequired &&
          !dynamicObject.objectValues.some((value) => value.objectProperty.id === op.id && value.value.trim() !== '')
        );
      });

      if (missingMandatoryProps.length > 0) {
        const missingPropsNames = missingMandatoryProps.map((prop) => prop.name).join(', ');
        throw new BadRequestException(`Missing mandatory properties: ${missingPropsNames}`);
      }

      return dynamicObject;
    });
  }
}
