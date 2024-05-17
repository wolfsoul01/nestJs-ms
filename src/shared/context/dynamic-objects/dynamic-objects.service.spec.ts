import { Test, TestingModule } from '@nestjs/testing';
import { DynamicObjectsService } from './dynamic-objects.service';
import { UsersService } from '../users/domain/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { dbConfig } from '@avantodev/avanto-shared-resources';
import { In, Repository } from 'typeorm';
import { findOneUserResult } from '../users/domain/stubs/users.stubs';
import { fetchedObjectDefinition } from '../object-definitions/domain/stubs/object-definitions.stub';
import { ObjectDefinitionsService } from '../object-definitions/object-definitions.service';
import { TenantsService } from '../tenants/domain/tenants.service';
import { tenantStub } from '../tenants/domain/stubs/tenants.stub';
import { DynamicObject } from '@avantodev/avanto-db';
import { createDynamicObjectDto, dynamicObjectStub } from './domain/stubs/dynamic-objects.stub';
import { NotFoundException } from '@nestjs/common';
import { objectPropertyStub } from '../object-properties/domain/stubs/object-properties.stub';

describe('DynamicObjectsService', () => {
  let service: DynamicObjectsService;
  let mockDynamicObjectRepository: jest.Mocked<Repository<DynamicObject>>;
  let mockUsersService: jest.Mocked<UsersService>;
  let mockObjectDefinitionsService: jest.Mocked<ObjectDefinitionsService>;
  let mockTenantsService: jest.Mocked<TenantsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DynamicObjectsService,
        {
          provide: getRepositoryToken(DynamicObject, dbConfig.name),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn().mockReturnValue(new DynamicObject()),
            save: jest.fn().mockReturnValue(new DynamicObject()),
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
          provide: TenantsService,
          useValue: {
            findOne: jest.fn().mockReturnValue(tenantStub),
          },
        },
      ],
    }).compile();

    service = module.get<DynamicObjectsService>(DynamicObjectsService);
    mockDynamicObjectRepository = module.get(getRepositoryToken(DynamicObject, dbConfig.name));
    mockUsersService = module.get(UsersService);
    mockTenantsService = module.get(TenantsService);
    mockObjectDefinitionsService = module.get(ObjectDefinitionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create the dynamic object', async () => {
      mockUsersService.findOne.mockResolvedValue(findOneUserResult);

      mockTenantsService.findOne.mockResolvedValue(tenantStub);

      mockObjectDefinitionsService.findOne.mockResolvedValue(fetchedObjectDefinition[0]);

      mockDynamicObjectRepository.save.mockResolvedValueOnce(dynamicObjectStub);

      const result = await service.create(createDynamicObjectDto);

      expect(result.createdBy.id).toEqual(createDynamicObjectDto.createdById);
      expect(result.updatedBy.id).toEqual(createDynamicObjectDto.createdById);

      expect(result.objectDefinition.id).toEqual(createDynamicObjectDto.objectDefinitionId);

      expect(result.tenant.id).toEqual(createDynamicObjectDto.tenantId);

      expect(result.enabled).toEqual(createDynamicObjectDto.enabled);

      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
      expect(result.id).toBeDefined();
    });

    it('should throw an error if a tenant does not exists', async () => {
      mockUsersService.findOne.mockResolvedValue(findOneUserResult);

      mockObjectDefinitionsService.findOne.mockResolvedValue(fetchedObjectDefinition[0]);

      mockTenantsService.findOne.mockResolvedValueOnce(null);

      await expect(service.create(createDynamicObjectDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if a user does not exists', async () => {
      mockUsersService.findOne.mockResolvedValue(null);

      mockObjectDefinitionsService.findOne.mockResolvedValue(fetchedObjectDefinition[0]);

      mockTenantsService.findOne.mockResolvedValueOnce(tenantStub);

      await expect(service.create(createDynamicObjectDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if a object definition does not exists', async () => {
      mockUsersService.findOne.mockResolvedValue(findOneUserResult);

      mockObjectDefinitionsService.findOne.mockResolvedValue(null);

      mockTenantsService.findOne.mockResolvedValueOnce(tenantStub);

      await expect(service.create(createDynamicObjectDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of dynamic objects', async () => {
      mockDynamicObjectRepository.find.mockResolvedValue([dynamicObjectStub]);

      const result = await service.findAll();

      expect(result).toEqual([dynamicObjectStub]);
      expect(result.length).toEqual([objectPropertyStub].length);
    });

    it('should throw an error if there is a problem fetching the object definitions', async () => {
      mockDynamicObjectRepository.find.mockRejectedValue(new Error('Error fetching data'));

      await expect(service.findAll()).rejects.toThrow('Error fetching data');
    });

    it('should return an empty array if no object definitions are found', async () => {
      mockDynamicObjectRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findMany', () => {
    it('should return dynamic objects filtered by ids', async () => {
      const findDynamicObjectsDto = { ids: [1, 2] };
      mockDynamicObjectRepository.find.mockResolvedValue([dynamicObjectStub]);

      const result = await service.findMany(findDynamicObjectsDto);

      expect(result).toEqual([dynamicObjectStub]);
      expect(mockDynamicObjectRepository.find).toHaveBeenCalledWith({
        where: { id: In(findDynamicObjectsDto.ids) },
        relations: ['createdBy', 'updatedBy', 'tenant', 'objectDefinition'],
      });
    });

    it('should return dynamic objects filtered by objectDefinitionIds', async () => {
      const findDynamicObjectsDto = { objectDefinitionIds: [1] };
      mockDynamicObjectRepository.find.mockResolvedValue([dynamicObjectStub]);

      const result = await service.findMany(findDynamicObjectsDto);

      expect(result).toEqual([dynamicObjectStub]);
      expect(mockDynamicObjectRepository.find).toHaveBeenCalledWith({
        where: { objectDefinitionId: In(findDynamicObjectsDto.objectDefinitionIds) },
        relations: ['createdBy', 'updatedBy', 'tenant', 'objectDefinition'],
      });
    });

    it('should return dynamic objects filtered by tenantIds', async () => {
      const findDynamicObjectsDto = { tenantIds: [1] };
      mockDynamicObjectRepository.find.mockResolvedValue([dynamicObjectStub]);

      const result = await service.findMany(findDynamicObjectsDto);

      expect(result).toEqual([dynamicObjectStub]);
      expect(mockDynamicObjectRepository.find).toHaveBeenCalledWith({
        where: { tenantId: In(findDynamicObjectsDto.tenantIds) },
        relations: ['createdBy', 'updatedBy', 'tenant', 'objectDefinition'],
      });
    });

    it('should return dynamic objects filtered by createdByIds', async () => {
      const findDynamicObjectsDto = { createdByIds: [78] };
      mockDynamicObjectRepository.find.mockResolvedValue([dynamicObjectStub]);

      const result = await service.findMany(findDynamicObjectsDto);

      expect(result).toEqual([dynamicObjectStub]);
      expect(mockDynamicObjectRepository.find).toHaveBeenCalledWith({
        where: { createdById: In(findDynamicObjectsDto.createdByIds) },
        relations: ['createdBy', 'updatedBy', 'tenant', 'objectDefinition'],
      });
    });

    it('should return dynamic objects filtered by updatedByIds', async () => {
      const findDynamicObjectsDto = { updatedByIds: [78] };
      mockDynamicObjectRepository.find.mockResolvedValue([dynamicObjectStub]);

      const result = await service.findMany(findDynamicObjectsDto);

      expect(result).toEqual([dynamicObjectStub]);
      expect(mockDynamicObjectRepository.find).toHaveBeenCalledWith({
        where: { updatedById: In(findDynamicObjectsDto.updatedByIds) },
        relations: ['createdBy', 'updatedBy', 'tenant', 'objectDefinition'],
      });
    });

    it('should return dynamic objects filtered by enabled status', async () => {
      const findDynamicObjectsDto = { enabled: true };
      mockDynamicObjectRepository.find.mockResolvedValue([dynamicObjectStub]);

      const result = await service.findMany(findDynamicObjectsDto);

      expect(result).toEqual([dynamicObjectStub]);
      expect(mockDynamicObjectRepository.find).toHaveBeenCalledWith({
        where: { enabled: findDynamicObjectsDto.enabled },
        relations: ['createdBy', 'updatedBy', 'tenant', 'objectDefinition'],
      });
    });

    it('should return dynamic objects filtered by a combination of filters', async () => {
      const findDynamicObjectsDto = { ids: [1], tenantIds: [1], enabled: true };
      mockDynamicObjectRepository.find.mockResolvedValue([dynamicObjectStub]);

      const result = await service.findMany(findDynamicObjectsDto);

      expect(result).toEqual([dynamicObjectStub]);
      expect(mockDynamicObjectRepository.find).toHaveBeenCalledWith({
        where: {
          id: In(findDynamicObjectsDto.ids),
          tenantId: In(findDynamicObjectsDto.tenantIds),
          enabled: findDynamicObjectsDto.enabled,
        },
        relations: ['createdBy', 'updatedBy', 'tenant', 'objectDefinition'],
      });
    });
  });

  describe('update', () => {
    it('should update the dynamic object', async () => {
      const updateDynamicObjectDto = {
        id: 1,
        updatedById: 78,
        enabled: false,
        objectDefinitionId: 2,
        tenantId: 2,
      };
      const updatedDynamicObjectStub = {
        ...dynamicObjectStub,
        ...updateDynamicObjectDto,
        updatedBy: findOneUserResult,
        tenant: tenantStub,
        objectDefinition: fetchedObjectDefinition[1],
      };

      mockDynamicObjectRepository.findOne.mockResolvedValue(dynamicObjectStub);
      mockUsersService.findOne.mockResolvedValue(findOneUserResult);
      mockTenantsService.findOne.mockResolvedValue(tenantStub);
      mockObjectDefinitionsService.findOne.mockResolvedValue(fetchedObjectDefinition[1]);
      mockDynamicObjectRepository.save.mockResolvedValue(updatedDynamicObjectStub);

      const result = await service.update(updateDynamicObjectDto);

      expect(result).toEqual(updatedDynamicObjectStub);
    });

    it('should throw an error if the dynamic object does not exist', async () => {
      const updateDynamicObjectDto = {
        id: 99,
        updatedById: 78,
        enabled: false,
      };

      mockDynamicObjectRepository.findOne.mockResolvedValue(null);

      await expect(service.update(updateDynamicObjectDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if the updated by user does not exist', async () => {
      const updateDynamicObjectDto = {
        id: 1,
        updatedById: 99,
        enabled: false,
      };

      mockDynamicObjectRepository.findOne.mockResolvedValue(dynamicObjectStub);
      mockUsersService.findOne.mockResolvedValue(null);

      await expect(service.update(updateDynamicObjectDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if the tenant does not exist', async () => {
      const updateDynamicObjectDto = {
        id: 1,
        updatedById: 78,
        tenantId: 99,
      };

      mockDynamicObjectRepository.findOne.mockResolvedValue(dynamicObjectStub);
      mockTenantsService.findOne.mockResolvedValue(null);

      await expect(service.update(updateDynamicObjectDto)).rejects.toThrow(NotFoundException);
    });
  });
});
