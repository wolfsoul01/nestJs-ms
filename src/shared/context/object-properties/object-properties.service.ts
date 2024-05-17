import { BadRequestException, Inject, Injectable, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { dbConfig } from '@avantodev/avanto-shared-resources';
import { In, Not, Repository } from 'typeorm';
import { ObjectProperty } from '@avantodev/avanto-db';
import { CreateObjectPropertyDto } from './domain/dtos/create-object-properties.dto';
import { UpdateObjectPropertyDto } from './domain/dtos/update-object-properties.dto';
import { FindObjectPropertiesDto } from './domain/dtos/find-object-properties.dto';
import { UsersService } from '../users/domain/users.service';
import { ObjectDefinitionsService } from '../object-definitions/object-definitions.service';
import { getObjectPropertiesDataTypeEnum } from '../../../shared/utils';
import { ListsService } from '../lists/domain/lists.service';
import { ObjectPropertiesDataTypeEnum } from '../../../shared/dataTypes/Enums';

@Injectable()
export class ObjectPropertiesService {
  private readonly logger = new Logger(ObjectPropertiesService.name);

  constructor(
    @InjectRepository(ObjectProperty, dbConfig.name)
    private readonly objectPropertyRepository: Repository<ObjectProperty>,

    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => ObjectDefinitionsService))
    private readonly objectDefinitionsService: ObjectDefinitionsService,
    @Inject(ListsService)
    private readonly listService: ListsService,
  ) {
    this.logger.log('ObjectPropertiesService initialized');
  }

  async create(createObjectPropertyDto: CreateObjectPropertyDto): Promise<ObjectProperty> {
    this.logger.log(`Creating Object Property: ${JSON.stringify(createObjectPropertyDto)}`);
    try {
      const { name, description, createdById, objectDefinitionId, dataType, listTypeId, objectTypeId } =
        createObjectPropertyDto;

      const foundedObjectDefinition = await this.objectDefinitionsService.findOne(objectDefinitionId);

      if (!foundedObjectDefinition) {
        this.logger.error(`Object definition with ID: ${objectDefinitionId} was not found.`);
        throw new NotFoundException(`Object definition with ID: ${objectDefinitionId} was not found.`);
      }

      const foundPropertyWithThatNameAndObjectDefinition = await this.objectPropertyRepository.findOne({
        where: {
          name: name.trim(),
          objectDefinition: foundedObjectDefinition,
        },
      });

      if (foundPropertyWithThatNameAndObjectDefinition) {
        this.logger.error(
          `Object property with name: ${name} and object definition with ID: ${objectDefinitionId} already exists.`,
        );
        throw new BadRequestException(
          `Object property with name: ${name} and object definition with ID: ${objectDefinitionId} already exists.`,
        );
      }

      const foundCreatorUser = await this.usersService.findOne(createdById);
      this.logger.debug(`Found creator user with ID: ${createdById}`);

      if (!foundCreatorUser) {
        this.logger.warn(`User not found with ID: ${createdById}`);
        throw new NotFoundException(`Not found user with id:${createdById}`);
      }

      let foundedListType, foundedObjectType;

      if (getObjectPropertiesDataTypeEnum(dataType) === ObjectPropertiesDataTypeEnum.List) {
        foundedListType = await this.listService.findOne(listTypeId);

        this.logger.debug(foundedListType);

        if (!foundedListType) {
          this.logger.error(`List with ID: ${listTypeId} was not found.`);
          throw new NotFoundException(`List with ID: ${listTypeId} was not found.`);
        }
      } else if (getObjectPropertiesDataTypeEnum(dataType) === ObjectPropertiesDataTypeEnum.Object) {
        if (objectTypeId === objectDefinitionId) {
          this.logger.error('Object type and object definition can not be the same');
          throw new BadRequestException('Object type and object definition can not be the same');
        }

        foundedObjectType = await this.objectDefinitionsService.findOne(objectTypeId);

        if (!foundedObjectType) {
          this.logger.error(`Object definition with ID: ${objectTypeId} was not found.`);
          throw new NotFoundException(`Object definition with ID: ${objectTypeId} was not found.`);
        }
      }

      const savedObjectProperty = await this.objectPropertyRepository.save({
        ...createObjectPropertyDto,
        name: name.trim(),
        description: description?.trim(),
        createdBy: foundCreatorUser,
        updatedBy: foundCreatorUser,
        dataType: getObjectPropertiesDataTypeEnum(dataType),
        objectDefinition: foundedObjectDefinition,
        listType:
          getObjectPropertiesDataTypeEnum(dataType) === ObjectPropertiesDataTypeEnum.List ? foundedListType : null,
        objectType:
          getObjectPropertiesDataTypeEnum(dataType) === ObjectPropertiesDataTypeEnum.Object ? foundedObjectType : null,
      });

      this.logger.log(`Object Property created with ID: ${savedObjectProperty.id}`);
      return savedObjectProperty;
    } catch (error) {
      this.logger.error(`Failed to create Object Property: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: number): Promise<ObjectProperty | null> {
    this.logger.log(`Finding Object Property with ID: ${id}`);
    try {
      const objectProperty = await this.objectPropertyRepository.findOne({
        where: { id },
        relations: ['objectDefinition', 'createdBy', 'updatedBy', 'objectType', 'listType'],
      });

      if (!objectProperty) {
        this.logger.warn(`Object Property with ID: ${id} not found`);
        throw new NotFoundException(`Object Property with ID: ${id} was not found.`);
      }

      this.logger.debug(`Found Object Property with ID: ${id}`);
      return objectProperty;
    } catch (error) {
      this.logger.error(`Failed to find Object Property with ID: ${id}, ${error.message}`);
      throw error;
    }
  }

  async findMany(findObjectPropertiesDto: FindObjectPropertiesDto): Promise<ObjectProperty[] | null> {
    this.logger.log(`Finding many Object Properties with criteria: ${JSON.stringify(findObjectPropertiesDto)}`);
    try {
      const objectProperties = await this.objectPropertyRepository.find({
        where: {
          ...(findObjectPropertiesDto.id && { id: findObjectPropertiesDto.id }),
          ...(findObjectPropertiesDto.ids && { id: In(findObjectPropertiesDto.ids) }),
          ...(findObjectPropertiesDto.names && { name: In(findObjectPropertiesDto.names) }),
          ...(findObjectPropertiesDto.name && { name: findObjectPropertiesDto.name }),
          ...(findObjectPropertiesDto.datatypes && { dataType: In(findObjectPropertiesDto.datatypes) }),
          ...(findObjectPropertiesDto.dataType && { dataType: findObjectPropertiesDto.dataType }),
          ...(findObjectPropertiesDto.createdByIds && { createdById: In(findObjectPropertiesDto.createdByIds) }),
          ...(findObjectPropertiesDto.createdById && { createdById: findObjectPropertiesDto.createdById }),
          ...(findObjectPropertiesDto.updatedByIds && { updatedById: In(findObjectPropertiesDto.updatedByIds) }),
          ...(findObjectPropertiesDto.updatedById && { updatedById: findObjectPropertiesDto.updatedById }),
          ...(findObjectPropertiesDto.objectDefinitionIds && {
            objectDefinition: { id: In(findObjectPropertiesDto.objectDefinitionIds) },
          }),
          ...(findObjectPropertiesDto.objectDefinitionId && {
            objectDefinition: { id: findObjectPropertiesDto.objectDefinitionId },
          }),
          ...(findObjectPropertiesDto.isDisplayable !== undefined && {
            isDisplayable: findObjectPropertiesDto.isDisplayable,
          }),
          ...(findObjectPropertiesDto.isRequired !== undefined && { isRequired: findObjectPropertiesDto.isRequired }),
          ...(findObjectPropertiesDto.enabled !== undefined && { enabled: findObjectPropertiesDto.enabled }),
          ...(findObjectPropertiesDto.listTypeIds && { listType: { id: In(findObjectPropertiesDto.listTypeIds) } }),
          ...(findObjectPropertiesDto.objectTypeIds && {
            objectType: { id: In(findObjectPropertiesDto.objectTypeIds) },
          }),
          ...(findObjectPropertiesDto.listTypeId && { listType: { id: findObjectPropertiesDto.listTypeId } }),
          ...(findObjectPropertiesDto.objectTypeId && { objectType: { id: findObjectPropertiesDto.objectTypeId } }),
        },
        relations: ['createdBy', 'updatedBy', 'objectDefinition', 'objectType', 'listType'],
      });

      this.logger.debug(`Found ${objectProperties.length} Object Properties`);
      return objectProperties;
    } catch (error) {
      this.logger.error(`Failed to find many Object Properties: ${error.message}`);
      throw error;
    }
  }

  async update(updateObjectPropertyDto: UpdateObjectPropertyDto) {
    this.logger.log(`Updating Object Property: ${JSON.stringify(updateObjectPropertyDto)}`);
    try {
      const {
        id,
        name,
        description,
        updatedById,
        objectDefinitionId,
        dataType,
        objectTypeId,
        listTypeId,
        isDisplayable,
        isRequired,
        order,
        enabled,
      } = updateObjectPropertyDto;

      const foundObjectProperty = await this.findOne(id);
      if (!foundObjectProperty) {
        this.logger.error(`Object property with ID: ${id} was not found.`);
        throw new NotFoundException(`Object property with ID: ${id} was not found.`);
      }

      const foundedObjectDefinition =
        objectDefinitionId && (await this.objectDefinitionsService.findOne(objectDefinitionId));
      if (!foundedObjectDefinition && objectDefinitionId) {
        this.logger.error(`Object definition with ID: ${objectDefinitionId} was not found.`);
        throw new NotFoundException(`Object definition with ID: ${objectDefinitionId} was not found.`);
      }

      const foundPropertyWithThatNameAndObjectDefinition = await this.objectPropertyRepository.findOne({
        where: {
          name: name.trim(),
          objectDefinition: foundObjectProperty.objectDefinition,
          id: Not(foundObjectProperty.id),
        },
      });

      if (foundPropertyWithThatNameAndObjectDefinition) {
        this.logger.error(
          `Object property with name: ${name} and object definition with ID: ${objectDefinitionId} already exists.`,
        );
        throw new BadRequestException(
          `Object property with name: ${name} and object definition with ID: ${objectDefinitionId} already exists.`,
        );
      }

      if (!updatedById) {
        throw new BadRequestException(`Upadter user must be provided`);
      }

      const foundUpdatedByUser = await this.usersService.findOne(updatedById);
      if (!foundUpdatedByUser) {
        this.logger.warn(`User with ID: ${updatedById} was not found.`);
        throw new NotFoundException(`User with ID: ${updatedById} was not found.`);
      }

      let foundedListType = null;
      let foundedObjectType = null;

      if (getObjectPropertiesDataTypeEnum(dataType) === ObjectPropertiesDataTypeEnum.List) {
        foundedListType = await this.listService.findOne(listTypeId);

        if (!foundedListType) {
          this.logger.error(`List with ID: ${listTypeId} was not found.`);
          throw new NotFoundException(`List with ID: ${listTypeId} was not found.`);
        }
      } else if (getObjectPropertiesDataTypeEnum(dataType) === ObjectPropertiesDataTypeEnum.Object) {
        if (objectTypeId === objectDefinitionId || foundObjectProperty.objectDefinition.id) {
          this.logger.error('Object type and object definition can not be the same');
          throw new BadRequestException('Object type and object definition can not be the same');
        }

        foundedObjectType = await this.objectDefinitionsService.findOne(objectTypeId);

        if (!foundedObjectType) {
          this.logger.error(`Object definition with ID: ${objectTypeId} was not found.`);
          throw new NotFoundException(`Object definition with ID: ${objectTypeId} was not found.`);
        }
      }

      const updatedObjectProperty = await this.objectPropertyRepository.save({
        ...foundObjectProperty,
        name: name?.trim(),
        description: description?.trim(),
        updatedBy: foundUpdatedByUser,
        objectDefinition: objectDefinitionId && foundedObjectDefinition,
        dataType: dataType && getObjectPropertiesDataTypeEnum(dataType),
        objectType: foundedObjectType && foundedObjectType,
        listType: foundedListType && foundedListType,
        isDisplayable: isDisplayable,
        isRequired: isRequired,
        order: order,
        enabled: enabled,
      });

      this.logger.log(`Object Property with ID: ${id} updated successfully`);
      return updatedObjectProperty;
    } catch (error) {
      this.logger.error(`Failed to update Object Property: ${error.message}`);
      throw error;
    }
  }
}
