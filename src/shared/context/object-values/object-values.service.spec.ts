import { Test, TestingModule } from '@nestjs/testing';
import { ObjectValuesService } from './object-values.service';
import { ObjectValuesMapper } from './domain/mappers/object-values.mapper';
import { ObjectValue } from '@avantodev/avanto-db';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DynamicObjectsService } from '../dynamic-objects/dynamic-objects.service';
import { dynamicObjectStub } from '../dynamic-objects/domain/stubs/dynamic-objects.stub';
import { ObjectPropertiesService } from '../object-properties/object-properties.service';
import { objectPropertyStub } from '../object-properties/domain/stubs/object-properties.stub';
import { mappedObjectValueStub, objectValueDto, objectValuesStub } from './domain/stubs/object-values.stub';
import { dbConfig } from '@avantodev/avanto-shared-resources';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FindObjectValueDto } from './domain/dtos/find-object-values.dto';

describe('ObjectValuesService', () => {
  let service: ObjectValuesService;
  let mapper: ObjectValuesMapper;
  let repository: jest.Mocked<Repository<ObjectValue>>;
  let mockObjectPropertiesService: jest.Mocked<ObjectPropertiesService>;
  let mockDynamicObjectsService: jest.Mocked<DynamicObjectsService>;
  let mockObjectValuesMapper: jest.Mocked<ObjectValuesMapper>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ObjectValuesService,
        {
          provide: getRepositoryToken(ObjectValue, dbConfig.name),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn().mockReturnValue(new ObjectValue()),
            save: jest.fn().mockReturnValue(new ObjectValue()),
            relations: jest.fn(),
          },
        },
        {
          provide: ObjectPropertiesService,
          useValue: {
            findOne: jest.fn(),
            findMany: jest.fn(),
          },
        },
        {
          provide: DynamicObjectsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: ObjectValuesMapper,
          useValue: {
            mapObjectValueWithDatatype: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ObjectValuesService>(ObjectValuesService);
    mapper = module.get<ObjectValuesMapper>(ObjectValuesMapper);
    repository = module.get(getRepositoryToken(ObjectValue, dbConfig.name));
    mockObjectPropertiesService = module.get(ObjectPropertiesService);
    mockDynamicObjectsService = module.get(DynamicObjectsService);
    mockObjectValuesMapper = module.get(ObjectValuesMapper);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mapper).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('createObjectValue', () => {
    it('should create a new object value successfully', async () => {
      mockDynamicObjectsService.findOne.mockResolvedValueOnce(dynamicObjectStub);
      mockObjectPropertiesService.findMany.mockResolvedValueOnce([objectPropertyStub]);
      mockObjectValuesMapper.mapObjectValueWithDatatype.mockResolvedValue(mappedObjectValueStub);
      repository.save.mockResolvedValueOnce(objectValuesStub);

      const result = await service.create(objectValueDto);

      expect(result).toEqual(objectValuesStub);
    });

    it('should throw NotFoundException if the dynamic object does not exist', async () => {
      mockDynamicObjectsService.findOne.mockResolvedValueOnce(null);

      await expect(service.create(objectValueDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if no object properties are found', async () => {
      mockDynamicObjectsService.findOne.mockResolvedValueOnce(dynamicObjectStub);
      mockObjectPropertiesService.findMany.mockResolvedValueOnce([]);

      await expect(service.create(objectValueDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if mapping of object value with datatype fails', async () => {
      mockDynamicObjectsService.findOne.mockResolvedValueOnce(dynamicObjectStub);
      mockObjectPropertiesService.findMany.mockResolvedValueOnce([objectPropertyStub]);
      mockObjectValuesMapper.mapObjectValueWithDatatype.mockRejectedValue(new BadRequestException());

      await expect(service.create(objectValueDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should find an object value successfully', async () => {
      const tag = objectValuesStub.tag;
      repository.findOne.mockResolvedValueOnce(objectValuesStub);

      const result = await service.findOne(tag);

      expect(result).toEqual(objectValuesStub);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { tag },
        relations: ['objectProperty', 'belongsToObject', 'listValue', 'objectValue'],
      });
    });

    it('should throw NotFoundException if the object value does not exist', async () => {
      const tag = 'non-existing-tag';
      repository.findOne.mockResolvedValueOnce(null);

      await expect(service.findOne(tag)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findMany', () => {
    it('should find multiple object values successfully', async () => {
      repository.find.mockResolvedValueOnce([objectValuesStub, objectValuesStub]);

      const result = await service.findMany(new FindObjectValueDto());

      expect(result.length).toBeGreaterThan(0);
      expect(result).toEqual([objectValuesStub, objectValuesStub]);
    });

    it('should return an empty array if no object values are found', async () => {
      repository.find.mockResolvedValueOnce([]);

      const result = await service.findMany(new FindObjectValueDto());

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update an object value successfully', async () => {
      const updateObjectValueDto = {
        belongsToObjectId: objectValuesStub.belongsToObject.id,
        objectPropertyId: objectValuesStub.objectProperty.id,
        value: 'Updated value',
      };

      mockDynamicObjectsService.findOne.mockResolvedValueOnce(dynamicObjectStub);
      mockObjectPropertiesService.findOne.mockResolvedValueOnce(objectPropertyStub);
      repository.findOne.mockResolvedValueOnce(objectValuesStub);
      mockObjectValuesMapper.mapObjectValueWithDatatype.mockResolvedValueOnce({
        ...mappedObjectValueStub,
        value: updateObjectValueDto.value,
      });
      repository.save.mockResolvedValueOnce({
        ...objectValuesStub,
        value: updateObjectValueDto.value,
      });

      const result = await service.update(updateObjectValueDto);

      expect(result.value).toEqual(updateObjectValueDto.value);
      expect(repository.save).toHaveBeenCalledWith({
        ...objectValuesStub,
        value: updateObjectValueDto.value,
      });
    });

    it('should throw NotFoundException if the object value does not exist', async () => {
      const updateObjectValueDto = {
        belongsToObjectId: objectValuesStub.belongsToObject.id,
        objectPropertyId: objectValuesStub.belongsToObject.id,
        value: 'Updated value',
      };

      repository.findOne.mockResolvedValueOnce(null);

      await expect(service.update(updateObjectValueDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if the object property does not exist', async () => {
      const updateObjectValueDto = {
        belongsToObjectId: objectValuesStub.belongsToObject.id,
        objectPropertyId: objectValuesStub.objectProperty.id,
        value: 'Updated value',
      };

      mockDynamicObjectsService.findOne.mockResolvedValueOnce(dynamicObjectStub);
      mockObjectPropertiesService.findOne.mockResolvedValueOnce(null);

      await expect(service.update(updateObjectValueDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if the belongs to object does not exist', async () => {
      const updateObjectValueDto = {
        belongsToObjectId: objectValuesStub.belongsToObject.id,
        objectPropertyId: objectValuesStub.objectProperty.id,
        value: 'Updated value',
      };

      mockDynamicObjectsService.findOne.mockResolvedValueOnce(null);

      await expect(service.update(updateObjectValueDto)).rejects.toThrow(NotFoundException);
    });
  });
});
