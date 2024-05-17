import { Test, TestingModule } from '@nestjs/testing';
import { ObjectPropertiesService } from './object-properties.service';
import { UsersService } from '../users/domain/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { dbConfig } from '@avantodev/avanto-shared-resources';
import { In, Repository } from 'typeorm';
import { findOneUserResult } from '../users/domain/stubs/users.stubs';
import { fetchedObjectDefinition } from '../object-definitions/domain/stubs/object-definitions.stub';
import { ObjectProperty } from '@avantodev/avanto-db';
import { ObjectDefinitionsService } from '../object-definitions/object-definitions.service';
import { CreateObjectPropertyDto } from './domain/dtos/create-object-properties.dto';
import { createObjectPropertyStringDto, objectPropertyStub } from './domain/stubs/object-properties.stub';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ListsService } from '../lists/domain/lists.service';
import { fetchedLists } from '../lists/domain/stubs/lists.stub';
import { FindObjectPropertiesDto } from './domain/dtos/find-object-properties.dto';
import { UpdateObjectPropertyDto } from './domain/dtos/update-object-properties.dto';

describe('ObjectPropertiesService', () => {
  let service: ObjectPropertiesService;
  let mockObjectPropertiesRepository: jest.Mocked<Repository<ObjectProperty>>;
  let mockUsersService: jest.Mocked<UsersService>;
  let mockObjectDefinitionsService: jest.Mocked<ObjectDefinitionsService>;
  let mockListsService: jest.Mocked<ListsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ObjectPropertiesService,
        {
          provide: getRepositoryToken(ObjectProperty, dbConfig.name),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn().mockReturnValue(new ObjectProperty()),
            save: jest.fn().mockReturnValue(new ObjectProperty()),
            relations: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockReturnValue(findOneUserResult),
          },
        },
        {
          provide: ObjectDefinitionsService,
          useValue: {
            findOne: jest.fn().mockReturnValue(fetchedObjectDefinition[0]),
          },
        },
        {
          provide: ListsService,
          useValue: {
            findOne: jest.fn().mockReturnValue(fetchedLists[0]),
          },
        },
      ],
    }).compile();

    service = module.get<ObjectPropertiesService>(ObjectPropertiesService);
    mockObjectPropertiesRepository = module.get(getRepositoryToken(ObjectProperty, dbConfig.name));
    mockObjectDefinitionsService = module.get(ObjectDefinitionsService);
    mockListsService = module.get(ListsService);
    mockUsersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let createObjectProperty: CreateObjectPropertyDto;

    beforeEach(() => {
      createObjectProperty = { ...createObjectPropertyStringDto };
    });

    it('should create the object property', async () => {
      mockObjectPropertiesRepository.findOne.mockResolvedValueOnce(null);
      mockUsersService.findOne.mockResolvedValueOnce(findOneUserResult);
      mockObjectDefinitionsService.findOne.mockResolvedValueOnce(fetchedObjectDefinition[0]);

      mockObjectPropertiesRepository.save.mockResolvedValueOnce(objectPropertyStub);

      const result = await service.create(createObjectProperty);

      expect(result.createdBy.id).toEqual(createObjectProperty.createdById);
      expect(result.updatedBy.id).toEqual(createObjectProperty.createdById);

      expect(result.objectDefinition.id).toEqual(createObjectProperty.objectDefinitionId);

      expect(result.enabled).toEqual(createObjectProperty.enabled);
      expect(result.dataType).toEqual(createObjectProperty.dataType);
      expect(result.description).toEqual(createObjectProperty.description);
      expect(result.isDisplayable).toEqual(createObjectProperty.isDisplayable);
      expect(result.isRequired).toEqual(createObjectProperty.isRequired);
      expect(result.name).toEqual(createObjectProperty.name);

      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
      expect(result.id).toBeDefined();
    });

    it('should throw an error if the object propertie name already exists for that object definition', async () => {
      mockObjectPropertiesRepository.findOne.mockResolvedValueOnce(objectPropertyStub);
      mockUsersService.findOne.mockResolvedValueOnce(findOneUserResult);
      mockObjectDefinitionsService.findOne.mockResolvedValueOnce(fetchedObjectDefinition[0]);

      mockObjectPropertiesRepository.save.mockResolvedValueOnce(objectPropertyStub);

      await expect(service.create(createObjectProperty)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if the user does not exist', async () => {
      mockUsersService.findOne.mockResolvedValueOnce(null);

      await expect(service.create(createObjectProperty)).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if the object definition does not exist', async () => {
      mockObjectDefinitionsService.findOne.mockResolvedValueOnce(null);

      await expect(service.create(createObjectProperty)).rejects.toThrow(NotFoundException);
    });

    it('should create without a description', async () => {
      const { description, ...createObjectPropertyWithoutDescription } = createObjectProperty;

      mockObjectPropertiesRepository.findOne.mockResolvedValueOnce(null);
      const result = await service.create(createObjectPropertyWithoutDescription);

      expect(result.description).toBeUndefined();
    });

    it('should trim name and description', async () => {
      const trimmedCreateObjectProperty = {
        ...createObjectProperty,
        name: ' Not trimmed name ',
        description: ' Not trimmed description ',
      };

      mockObjectDefinitionsService.findOne.mockResolvedValueOnce(fetchedObjectDefinition[0]);
      mockUsersService.findOne.mockResolvedValueOnce(findOneUserResult);
      mockObjectPropertiesRepository.save.mockResolvedValueOnce({
        ...objectPropertyStub,
        name: 'Not trimmed name',
        description: 'Not trimmed description',
      });

      const result = await service.create(trimmedCreateObjectProperty);

      expect(result.name).toEqual(trimmedCreateObjectProperty.name.trim());
      expect(result.description).toEqual(trimmedCreateObjectProperty.description.trim());
    });

    it('should create it with list type', async () => {
      const listDataTypePayload = {
        ...createObjectProperty,
        dataType: 'list',
        listTypeId: 1,
      };

      mockListsService.findOne.mockResolvedValueOnce(fetchedLists[0]);
      mockObjectDefinitionsService.findOne.mockResolvedValueOnce(fetchedObjectDefinition[0]);
      mockUsersService.findOne.mockResolvedValueOnce(findOneUserResult);
      mockObjectPropertiesRepository.save.mockResolvedValueOnce({
        ...objectPropertyStub,
        dataType: 'list',
        listType: fetchedLists[0],
      });

      const result = await service.create(listDataTypePayload);

      expect(result.dataType).toEqual('list');
      expect(result.listType.id).toEqual(listDataTypePayload.listTypeId);
    });

    it('should create with object type string if the provided one is wrong', async () => {
      const wrongDataTypePayload = {
        ...createObjectProperty,
        dataType: 'woo-hoo',
      };

      mockObjectDefinitionsService.findOne.mockResolvedValueOnce(fetchedObjectDefinition[0]);
      mockUsersService.findOne.mockResolvedValueOnce(findOneUserResult);
      mockObjectPropertiesRepository.save.mockResolvedValueOnce({
        ...objectPropertyStub,
        dataType: 'string',
      });

      const result = await service.create(wrongDataTypePayload);

      expect(result.dataType).toEqual('string');
    });
  });

  describe('findAll', () => {
    it('should return an array of object poroperties', async () => {
      mockObjectPropertiesRepository.find.mockResolvedValue([objectPropertyStub]);

      const result = await service.findMany(new FindObjectPropertiesDto());

      expect(result).toEqual([objectPropertyStub]);
      expect(result.length).toEqual([objectPropertyStub].length);
    });

    it('should throw an error if there is a problem fetching the object definitions', async () => {
      mockObjectPropertiesRepository.find.mockRejectedValue(new Error('Error fetching data'));

      await expect(service.findMany(new FindObjectPropertiesDto())).rejects.toThrow('Error fetching data');
    });

    it('should return an empty array if no object definitions are found', async () => {
      mockObjectPropertiesRepository.find.mockResolvedValue([]);

      const result = await service.findMany(new FindObjectPropertiesDto());

      expect(result).toEqual([]);
    });
  });

  describe('findMany', () => {
    it('should find object properties by ids', async () => {
      const ids = [1, 2];
      mockObjectPropertiesRepository.find.mockResolvedValue([objectPropertyStub]);

      const result = await service.findMany({ ids });

      expect(result).toEqual([objectPropertyStub]);
      expect(mockObjectPropertiesRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: In(ids) },
        }),
      );
    });

    it('should find object properties by names', async () => {
      const names = ['Test property'];
      mockObjectPropertiesRepository.find.mockResolvedValue([objectPropertyStub]);

      const result = await service.findMany({ names });

      expect(result).toEqual([objectPropertyStub]);
      expect(mockObjectPropertiesRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { name: In(names) },
        }),
      );
    });

    it('should find object properties by data types', async () => {
      const datatypes = ['string'];
      mockObjectPropertiesRepository.find.mockResolvedValue([objectPropertyStub]);

      const result = await service.findMany({ datatypes });

      expect(result).toEqual([objectPropertyStub]);
      expect(mockObjectPropertiesRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { dataType: In(datatypes) },
        }),
      );
    });

    it('should find object properties by createdByIds', async () => {
      const createdByIds = [78];
      mockObjectPropertiesRepository.find.mockResolvedValue([objectPropertyStub]);

      const result = await service.findMany({ createdByIds });

      expect(result).toEqual([objectPropertyStub]);
      expect(mockObjectPropertiesRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { createdById: In(createdByIds) },
        }),
      );
    });

    it('should find object properties by updatedByIds', async () => {
      const updatedByIds = [79];
      mockObjectPropertiesRepository.find.mockResolvedValue([objectPropertyStub]);

      const result = await service.findMany({ updatedByIds });

      expect(result).toEqual([objectPropertyStub]);
      expect(mockObjectPropertiesRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { updatedById: In(updatedByIds) },
        }),
      );
    });

    it('should find object properties by objectDefinitionIds', async () => {
      const objectDefinitionIds = [1];
      mockObjectPropertiesRepository.find.mockResolvedValue([objectPropertyStub]);

      const result = await service.findMany({ objectDefinitionIds });

      expect(result).toEqual([objectPropertyStub]);
      expect.objectContaining({
        where: { objectDefinitionId: In(objectDefinitionIds) },
      });
    });

    it('should find object properties by listTypeIds', async () => {
      const listTypeIds = [1];
      mockObjectPropertiesRepository.find.mockResolvedValue([objectPropertyStub]);

      const result = await service.findMany({ listTypeIds });

      expect(result).toEqual([objectPropertyStub]);
      expect.objectContaining({
        where: { listTypeId: In(listTypeIds) },
      });
    });

    it('should find object properties by objectTypeIds', async () => {
      const objectTypeIds = [1];
      mockObjectPropertiesRepository.find.mockResolvedValue([objectPropertyStub]);

      const result = await service.findMany({ objectTypeIds });

      expect(result).toEqual([objectPropertyStub]);
      expect.objectContaining({
        where: { objectTypeId: In(objectTypeIds) },
      });
    });

    it('should find object properties by combination of filters', async () => {
      const filters = {
        names: ['Test property'],
        datatypes: ['string'],
        createdByIds: [78],
      };
      mockObjectPropertiesRepository.find.mockResolvedValue([objectPropertyStub]);

      const result = await service.findMany(filters);

      expect(result).toEqual([objectPropertyStub]);
      expect(mockObjectPropertiesRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            name: In(filters.names),
            dataType: In(filters.datatypes),
            createdById: In(filters.createdByIds),
          }),
        }),
      );
    });

    it('should find object properties by id', async () => {
      const id = 1;
      mockObjectPropertiesRepository.find.mockResolvedValue([objectPropertyStub]);

      const result = await service.findMany({ id });

      expect(result).toEqual([objectPropertyStub]);
      expect(mockObjectPropertiesRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id },
        }),
      );
    });

    it('should find object properties by ids', async () => {
      const ids = [1, 2];
      mockObjectPropertiesRepository.find.mockResolvedValue([objectPropertyStub, objectPropertyStub]);

      const result = await service.findMany({ ids });

      expect(result).toEqual([objectPropertyStub, objectPropertyStub]);
      expect(mockObjectPropertiesRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: In(ids) },
        }),
      );
    });

    it('should find object properties by name', async () => {
      const names = ['Test property'];
      mockObjectPropertiesRepository.find.mockResolvedValue([objectPropertyStub]);

      const result = await service.findMany({ names });

      expect(result).toEqual([objectPropertyStub]);
      expect(mockObjectPropertiesRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { name: In(names) },
        }),
      );
    });

    it('should find object properties by datatype', async () => {
      const datatypes = ['string'];
      mockObjectPropertiesRepository.find.mockResolvedValue([objectPropertyStub]);

      const result = await service.findMany({ datatypes });

      expect(result).toEqual([objectPropertyStub]);
      expect(mockObjectPropertiesRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { dataType: In(datatypes) },
        }),
      );
    });

    it('should find object properties by createdById', async () => {
      const createdByIds = [78];
      mockObjectPropertiesRepository.find.mockResolvedValue([objectPropertyStub]);

      const result = await service.findMany({ createdByIds });

      expect(result).toEqual([objectPropertyStub]);
      expect(mockObjectPropertiesRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { createdById: In(createdByIds) },
        }),
      );
    });

    it('should find object properties by updatedById', async () => {
      const updatedByIds = [79];
      mockObjectPropertiesRepository.find.mockResolvedValue([objectPropertyStub]);

      const result = await service.findMany({ updatedByIds });

      expect(result).toEqual([objectPropertyStub]);
      expect(mockObjectPropertiesRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { updatedById: In(updatedByIds) },
        }),
      );
    });

    it('should find object properties by isDisplayable', async () => {
      const isDisplayable = true;
      mockObjectPropertiesRepository.find.mockResolvedValue([objectPropertyStub]);

      const result = await service.findMany({ isDisplayable });

      expect(result).toEqual([objectPropertyStub]);
      expect(mockObjectPropertiesRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isDisplayable },
        }),
      );
    });

    it('should find object properties by isRequired', async () => {
      const isRequired = true;
      mockObjectPropertiesRepository.find.mockResolvedValue([objectPropertyStub]);

      const result = await service.findMany({ isRequired });

      expect(result).toEqual([objectPropertyStub]);
      expect(mockObjectPropertiesRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isRequired },
        }),
      );
    });

    it('should find object properties by enabled', async () => {
      const enabled = true;
      mockObjectPropertiesRepository.find.mockResolvedValue([objectPropertyStub]);

      const result = await service.findMany({ enabled });

      expect(result).toEqual([objectPropertyStub]);
      expect(mockObjectPropertiesRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { enabled },
        }),
      );
    });

    it('should find object properties by combination of filters', async () => {
      const filters = {
        ids: [1, 2],
        names: ['Test property'],
        datatypes: ['string'],
        createdByIds: [78],
        updatedByIds: [79],
        isDisplayable: true,
        isRequired: true,
        enabled: true,
      };
      mockObjectPropertiesRepository.find.mockResolvedValue([objectPropertyStub, objectPropertyStub]);

      const result = await service.findMany(filters);

      expect(result).toEqual([objectPropertyStub, objectPropertyStub]);
      expect(mockObjectPropertiesRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: In(filters.ids),
            name: In(filters.names),
            dataType: In(filters.datatypes),
            createdById: In(filters.createdByIds),
            updatedById: In(filters.updatedByIds),
            isDisplayable: filters.isDisplayable,
            isRequired: filters.isRequired,
            enabled: filters.enabled,
          }),
        }),
      );
    });
  });

  describe('update', () => {
    let updateObjectPropertyDto: UpdateObjectPropertyDto;

    beforeEach(() => {
      updateObjectPropertyDto = {
        id: 1,
        name: 'Updated Test property',
        description: 'Updated description',
        updatedById: 79,
        objectDefinitionId: 1,
        dataType: 'string',
        isDisplayable: true,
        isRequired: true,
        order: 9,
        enabled: true,
        listTypeId: null,
        objectTypeId: null,
      };
    });

    it('should update an object property successfully', async () => {
      mockObjectPropertiesRepository.findOne.mockResolvedValueOnce(objectPropertyStub);
      mockObjectPropertiesRepository.findOne.mockResolvedValueOnce(null);

      mockObjectPropertiesRepository.save.mockResolvedValueOnce({
        ...objectPropertyStub,
        ...updateObjectPropertyDto,
      });
      mockUsersService.findOne.mockResolvedValue(findOneUserResult);
      mockObjectDefinitionsService.findOne.mockResolvedValue(fetchedObjectDefinition[0]);
      mockListsService.findOne.mockResolvedValue(null);
      const result = await service.update(updateObjectPropertyDto);

      expect(result).toEqual({
        ...objectPropertyStub,
        ...updateObjectPropertyDto,
      });
    });

    it('should throw an error if the name is already used for that object definition', async () => {
      mockObjectPropertiesRepository.findOne.mockResolvedValueOnce(objectPropertyStub);
      mockObjectPropertiesRepository.findOne.mockResolvedValueOnce(objectPropertyStub);

      mockObjectPropertiesRepository.save.mockResolvedValueOnce({
        ...objectPropertyStub,
        ...updateObjectPropertyDto,
      });
      mockUsersService.findOne.mockResolvedValue(findOneUserResult);
      mockObjectDefinitionsService.findOne.mockResolvedValue(fetchedObjectDefinition[0]);
      mockListsService.findOne.mockResolvedValue(null);
      await expect(service.update(updateObjectPropertyDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if object property does not exist', async () => {
      mockObjectPropertiesRepository.findOne.mockResolvedValue(null);

      await expect(service.update(updateObjectPropertyDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if updatedBy user does not exist', async () => {
      mockObjectPropertiesRepository.findOne.mockResolvedValueOnce(objectPropertyStub);
      mockObjectPropertiesRepository.findOne.mockResolvedValueOnce(null);
      mockUsersService.findOne.mockResolvedValue(null);

      await expect(service.update(updateObjectPropertyDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if object definition does not exist', async () => {
      mockObjectPropertiesRepository.findOne.mockResolvedValueOnce(objectPropertyStub);
      mockObjectPropertiesRepository.findOne.mockResolvedValueOnce(null);
      mockUsersService.findOne.mockResolvedValue(findOneUserResult);
      mockObjectDefinitionsService.findOne.mockResolvedValue(null);

      await expect(service.update(updateObjectPropertyDto)).rejects.toThrow(NotFoundException);
    });
  });
});
