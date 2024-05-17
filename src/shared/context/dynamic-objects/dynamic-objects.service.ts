import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DynamicObject } from '@avantodev/avanto-db';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { dbConfig } from '@avantodev/avanto-shared-resources';
import { EntityManager, In, Repository } from 'typeorm';
import { ObjectDefinitionsService } from '../object-definitions/object-definitions.service';
import { UsersService } from '../users/domain/users.service';
import { TenantsService } from '../tenants/domain/tenants.service';
import { CreateDynamicObjectDto } from './domain/dtos/create-dynamic-objects.dto';
import { FindDynamicObjectsDto } from './domain/dtos/find-dynamic-objects.dto';
import { UpdateDynamicObjectDto } from './domain/dtos/update-dynamic-objects.dto';

@Injectable()
export class DynamicObjectsService {
  private readonly logger = new Logger(DynamicObjectsService.name);

  constructor(
    @InjectRepository(DynamicObject, dbConfig.name) private readonly dynamicObjectRepository: Repository<DynamicObject>,

    @Inject(ObjectDefinitionsService)
    private readonly objectDefinitionsService: ObjectDefinitionsService,

    @Inject(UsersService)
    private readonly usersService: UsersService,

    @Inject(TenantsService)
    private readonly tenantsService: TenantsService,

    @InjectEntityManager(dbConfig.name) private readonly manager: EntityManager,
  ) {
    this.logger.log('DynamicObjectsService initialized');
  }

  async create(createDynamicObjectDto: CreateDynamicObjectDto): Promise<DynamicObject> {
    this.logger.log(`Creating Dynamic Object: ${JSON.stringify(createDynamicObjectDto)}`);
    try {
      const { createdById, tenantId, objectDefinitionId } = createDynamicObjectDto;

      const foundCreatorUser = await this.usersService.findOne(createdById);
      this.logger.debug(`Found creator user with ID: ${createdById}`);

      if (!foundCreatorUser) {
        this.logger.error(`User not found with ID: ${createdById}`);
        throw new NotFoundException(`Not found user with id:${createdById}`);
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

      const savedObject = await this.dynamicObjectRepository.save({
        ...createDynamicObjectDto,
        createdBy: foundCreatorUser,
        updatedBy: foundCreatorUser,
        tenant: foundTenant,
        objectDefinition: foundObjectDefinition,
      });
      this.logger.log(`Dynamic Object created with ID: ${savedObject.id}`);
      return savedObject;
    } catch (error) {
      this.logger.error(`Failed to create Dynamic Object: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findMany(findDynamicObjectsDto: FindDynamicObjectsDto): Promise<DynamicObject[]> {
    this.logger.log(`Finding Dynamic Objects with criteria: ${JSON.stringify(findDynamicObjectsDto)}`);
    try {
      const dynamicObjects = await this.dynamicObjectRepository.find({
        where: {
          ...(findDynamicObjectsDto.ids && { id: In(findDynamicObjectsDto.ids) }),
          ...(findDynamicObjectsDto.objectDefinitionIds && {
            objectDefinitionId: In(findDynamicObjectsDto.objectDefinitionIds),
          }),
          ...(findDynamicObjectsDto.tenantIds && { tenantId: In(findDynamicObjectsDto.tenantIds) }),
          ...(findDynamicObjectsDto.createdByIds && { createdById: In(findDynamicObjectsDto.createdByIds) }),
          ...(findDynamicObjectsDto.updatedByIds && { updatedById: In(findDynamicObjectsDto.updatedByIds) }),
          ...(findDynamicObjectsDto.enabled !== undefined && { enabled: findDynamicObjectsDto.enabled }),
        },
        relations: ['createdBy', 'updatedBy', 'tenant', 'objectDefinition'],
      });
      this.logger.debug(`Found ${dynamicObjects.length} Dynamic Objects matching criteria`);
      return dynamicObjects;
    } catch (error) {
      this.logger.error(
        `Error finding Dynamic Objects with criteria: ${JSON.stringify(findDynamicObjectsDto)}: ${error.message}`,
        { stack: error.stack },
      );
      throw error;
    }
  }

  async findOne(id: number): Promise<DynamicObject> {
    this.logger.log(`Finding Dynamic Object with ID: ${id}`);
    try {
      const result = await this.dynamicObjectRepository.findOne({
        where: { id },
        relations: [
          'objectDefinition',
          'createdBy',
          'updatedBy',
          'tenant',
          'objectDefinition.objectProperties',
          'objectValues',
        ],
      });

      if (!result) {
        this.logger.error(`Dynamic Object not found with ID: ${id}`);
        throw new NotFoundException(`Not found dynamic object with id ${id}`);
      }
      this.logger.debug(`Found Dynamic Object with ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error finding Dynamic Object with ID: ${id}: ${error.message}`, { stack: error.stack });
      throw error;
    }
  }

  async findAll(): Promise<DynamicObject[]> {
    this.logger.log('Fetching all dynamic objects...');
    try {
      const dynamicObjects = await this.dynamicObjectRepository.find({
        relations: ['createdBy', 'updatedBy', 'tenant', 'objectDefinition'],
      });
      this.logger.debug(`Fetched ${dynamicObjects.length} dynamic objects.`);
      return dynamicObjects;
    } catch (error) {
      this.logger.error(`Failed to fetch all dynamic objects: ${error.message}`, { stack: error.stack });
      throw error;
    }
  }

  async update(updateDynamicObjectDto: UpdateDynamicObjectDto): Promise<DynamicObject> {
    const { id } = updateDynamicObjectDto;
    this.logger.log(`Updating Dynamic Object with ID: ${id}`);
    try {
      const foundDynamicObject = await this.findOne(id);

      if (!foundDynamicObject) {
        this.logger.error(`Dynamic Object not found with ID: ${id}`);
        throw new NotFoundException(`Not found dynamic object with id ${id}`);
      }

      this.logger.debug(`Found Dynamic Object with ID: ${id}`);

      const { updatedById, tenantId, objectDefinitionId } = updateDynamicObjectDto;

      const foundUpdatedByUser = await this.usersService.findOne(updatedById);
      this.logger.debug(`Found updated by user with ID: ${updatedById}`);

      if (!foundUpdatedByUser) {
        this.logger.error(`Updated by user not found with ID: ${updatedById}`);
        throw new NotFoundException(`Not found updated by user with id ${updatedById}`);
      }

      if (tenantId) {
        this.logger.debug(`Found tenant with ID: ${tenantId}`);
        const foundTenant = await this.tenantsService.findOne(tenantId);

        if (!foundTenant) {
          this.logger.error(`Tenant not found with ID: ${tenantId}`);
          throw new NotFoundException(`Not found tenant with id ${tenantId}`);
        }

        foundDynamicObject.tenant = foundTenant;
      }

      if (objectDefinitionId) {
        this.logger.debug(`Found object definition with ID: ${objectDefinitionId}`);

        const foundObjectDefinition = await this.objectDefinitionsService.findOne(objectDefinitionId);

        if (!foundObjectDefinition) {
          this.logger.error(`Object definition not found with ID: ${objectDefinitionId}`);
          throw new NotFoundException(`Not found object definition with id ${objectDefinitionId}`);
        }

        foundDynamicObject.objectDefinition = foundObjectDefinition;
      }

      const updatedObject = await this.dynamicObjectRepository.save({
        ...foundDynamicObject,
        ...updateDynamicObjectDto,
        updatedBy: foundUpdatedByUser,
      });
      this.logger.log(`Dynamic Object updated with ID: ${updatedObject.id}`);
      return updatedObject;
    } catch (error) {
      this.logger.error(`Failed to update Dynamic Object with ID: ${id}: ${error.message}`, { stack: error.stack });
      throw error;
    }
  }
}
