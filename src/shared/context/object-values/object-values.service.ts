import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { dbConfig } from '@avantodev/avanto-shared-resources';
import { In, Repository } from 'typeorm';
import { ObjectValue } from '@avantodev/avanto-db';
import { ObjectPropertiesService } from '../object-properties/object-properties.service';
import { DynamicObjectsService } from '../dynamic-objects/dynamic-objects.service';
import { ObjectValuesMapper } from './domain/mappers/object-values.mapper';
import { CreateObjectValueDto } from './domain/dtos/create-object-values.dto';
import { UpdateObjectValueDto } from './domain/dtos/update-object-values.dto';
import { FindObjectValueDto } from './domain/dtos/find-object-values.dto';

@Injectable()
export class ObjectValuesService {
  private readonly logger = new Logger(ObjectValuesService.name);

  constructor(
    @InjectRepository(ObjectValue, dbConfig.name)
    private readonly objectValueRepository: Repository<ObjectValue>,

    @Inject(ObjectPropertiesService)
    private readonly objectPropertiesService: ObjectPropertiesService,

    @Inject(DynamicObjectsService)
    private readonly dynamicObjectsService: DynamicObjectsService,

    @Inject(ObjectValuesMapper)
    private readonly objectValuesMapper: ObjectValuesMapper,
  ) {}

  async create(createObjectValueDto: CreateObjectValueDto): Promise<ObjectValue> {
    try {
      this.logger.log(`Creating ObjectValue with details: ${JSON.stringify(createObjectValueDto)}`);
      const { objectPropertyId, belongsToObjectId, value } = createObjectValueDto;

      const foundObject = await this.dynamicObjectsService.findOne(belongsToObjectId);

      if (!foundObject) {
        this.logger.error(`Object with id ${belongsToObjectId} not found`);
        throw new NotFoundException(`Object with id ${belongsToObjectId} not found`);
      }

      const foundObjectProperties = await this.objectPropertiesService.findMany({
        objectDefinitionId: foundObject.objectDefinition.id,
        id: objectPropertyId,
      });

      if (!foundObjectProperties.length) {
        this.logger.error(`Object property with id ${objectPropertyId} not found`);
        throw new NotFoundException(`Object property with id ${objectPropertyId} not found`);
      }

      const foundObjectProperty = foundObjectProperties[0];

      const tag = `${foundObject.objectDefinition.id};${foundObjectProperty.id};${foundObject.id}`;

      const valueMapped = await this.objectValuesMapper.mapObjectValueWithDatatype({
        objectProperty: foundObjectProperty,
        value,
      });

      const savedObjectValue = await this.objectValueRepository.save({
        ...valueMapped,
        objectProperty: foundObjectProperty,
        belongsToObject: foundObject,
        tag,
      });

      this.logger.log(`ObjectValue created with ID: ${savedObjectValue.tag}`);
      return savedObjectValue;
    } catch (error) {
      this.logger.error(`Failed to create ObjectValue: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(tag: string): Promise<ObjectValue> {
    try {
      this.logger.log(`Finding ObjectValue with ID: ${tag}`);
      const objectValue = await this.objectValueRepository.findOne({
        where: { tag },
        relations: ['objectProperty', 'belongsToObject', 'listValue', 'objectValue'],
      });
      if (!objectValue) {
        this.logger.error(`Object value with id ${tag} not found`);
        throw new NotFoundException(`Object value with id ${tag} not found`);
      }
      this.logger.log(`Found ObjectValue with ID: ${tag}`);
      return objectValue;
    } catch (error) {
      this.logger.error(`Error finding ObjectValue with ID: ${tag}: ${error.message}`, { stack: error.stack });
      throw error;
    }
  }

  async findMany(findObjectValueDto: FindObjectValueDto): Promise<ObjectValue[]> {
    try {
      this.logger.log(`Finding multiple ObjectValues with criteria: ${JSON.stringify(findObjectValueDto)}`);
      const {
        belongsToObjectIds,
        objectPropertyIds,
        values,
        objectValueIds,
        tags,
        belongsToObjectId,
        listsValueIds,
        objectPropertyId,
        objectValueId,
        tag,
        value,
      } = findObjectValueDto;
      const objectValues = await this.objectValueRepository.find({
        where: {
          ...(belongsToObjectIds && { belongsToObject: In(belongsToObjectIds) }),
          ...(objectPropertyIds && { objectProperty: In(objectPropertyIds) }),
          ...(values && { value: In(values) }),
          ...(objectValueIds && { id: In(objectValueIds) }),
          ...(tags && { tag: In(tags) }),
          ...(belongsToObjectId && { belongsToObject: { id: belongsToObjectId } }),
          ...(objectPropertyId && { objectProperty: { id: objectPropertyId } }),
          ...(objectValueId && { id: objectValueId }),
          ...(value && { value }),
          ...(listsValueIds && { listsValue: In(listsValueIds) }),
          ...(tag && { tag }),
        },
        relations: ['objectProperty', 'belongsToObject', 'listValue', 'objectValue'],
      });
      this.logger.log(`Found ${objectValues.length} ObjectValues matching criteria`);
      return objectValues;
    } catch (error) {
      this.logger.error(`Error finding multiple ObjectValues: ${error.message}`, { stack: error.stack });
      throw error;
    }
  }

  async update(updateObjectValueDto: UpdateObjectValueDto): Promise<ObjectValue> {
    try {
      this.logger.log(`Updating ObjectValue using details: ${JSON.stringify(updateObjectValueDto)}`);
      const { belongsToObjectId, objectPropertyId, value } = updateObjectValueDto;

      const objectValue = await this.objectValueRepository.findOne({
        where: {
          belongsToObject: { id: belongsToObjectId },
          objectProperty: { id: objectPropertyId },
        },
        relations: ['objectProperty', 'belongsToObject', 'listValue', 'objectValue'],
      });

      if (objectPropertyId) {
        const foundObjectProperty = await this.objectPropertiesService.findOne(objectPropertyId);
        if (!foundObjectProperty) {
          this.logger.error(`Object property with id ${objectPropertyId} not found`);
          throw new NotFoundException(`Object property with id ${objectPropertyId} not found`);
        }

        objectValue.objectProperty = foundObjectProperty;
      }

      if (belongsToObjectId) {
        const foundObject = await this.dynamicObjectsService.findOne(belongsToObjectId);
        if (!foundObject) {
          this.logger.error(`Object with id ${belongsToObjectId} not found`);
          throw new NotFoundException(`Object with id ${belongsToObjectId} not found`);
        }

        objectValue.belongsToObject = foundObject;
      }

      if (value) {
        const valueMapped = await this.objectValuesMapper.mapObjectValueWithDatatype({
          objectProperty: objectValue.objectProperty,
          value: value,
        });

        objectValue.value = valueMapped.value;
        objectValue.listsValues = valueMapped.listsValues;
        objectValue.objectValue = valueMapped.objectValue;
      }

      objectValue.tag = `${objectValue.objectProperty.objectDefinition.id};${objectValue.objectProperty.id};${objectValue.belongsToObject.id}`;

      const updatedObjectValue = await this.objectValueRepository.save(objectValue);
      this.logger.log(`ObjectValue updated successfully`);
      return updatedObjectValue;
    } catch (error) {
      this.logger.error(`Failed to update ObjectValue: ${error.message}`, error.stack);
      throw error;
    }
  }
}
