import { Test, TestingModule } from '@nestjs/testing';
import { ObjectDefinitionsService } from './object-definitions.service';
import { UsersService } from '../users/domain/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectDefinition, User } from '@avantodev/avanto-db';
import { dbConfig } from '@avantodev/avanto-shared-resources';
import { In, Repository } from 'typeorm';
import { CreateObjectDefinitionDto } from './domain/dtos/create-object-definitions.dto';
import { findOneUserResult } from '../users/domain/stubs/users.stubs';
import { createObjectDefinitionDto } from './domain/stubs/object-definitions.stub';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { FindObjectDefinitionDto } from './domain/dtos/find-object-definitions.dto';
import { fetchedObjectDefinition } from './domain/stubs/object-definitions.stub';
import { updateObjectDefinitionDto } from './domain/stubs/object-definitions.stub';

describe('ObjectDefinitionsService', () => {
  let service: ObjectDefinitionsService;
  let mockObjectDefinitionRepository: jest.Mocked<Repository<ObjectDefinition>>;
  let mockUsersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ObjectDefinitionsService,
        {
          provide: getRepositoryToken(ObjectDefinition, dbConfig.name),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn().mockReturnValue(new ObjectDefinition()),
            save: jest.fn().mockReturnValue(new ObjectDefinition()),
            relations: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockReturnValue(findOneUserResult),
          },
        },
      ],
    }).compile();

    service = module.get<ObjectDefinitionsService>(ObjectDefinitionsService);
    mockObjectDefinitionRepository = module.get(getRepositoryToken(ObjectDefinition, dbConfig.name));
    mockUsersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let createObjectDefinition: CreateObjectDefinitionDto;

    beforeEach(() => {
      createObjectDefinition = { ...createObjectDefinitionDto };
    });

    it('should create the object definition', async () => {
      mockObjectDefinitionRepository.findOne.mockResolvedValueOnce(null);
      mockUsersService.findOne.mockResolvedValueOnce(findOneUserResult);
      mockObjectDefinitionRepository.save.mockResolvedValueOnce({
        ...createObjectDefinitionDto,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: findOneUserResult,
        updatedBy: findOneUserResult,
      } as unknown as ObjectDefinition);
      const result = await service.create(createObjectDefinition);

      expect(result.createdBy.id).toEqual(createObjectDefinition.createdById);
      expect(result.name).toEqual(createObjectDefinition.name);
      expect(result.updatedBy.id).toEqual(createObjectDefinition.createdById);
      expect(result.description).toEqual(createObjectDefinition.description);
      expect(result.enabled).toEqual(createObjectDefinition.enabled);
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
      expect(result.id).toBeDefined();
    });

    it('should throw an error if the user does not exist', async () => {
      mockUsersService.findOne.mockResolvedValueOnce(null);

      await expect(service.create(createObjectDefinition)).rejects.toThrow(NotFoundException);
    });

    it('should throw a forbidden exception if the name already existed', async () => {
      mockObjectDefinitionRepository.findOne.mockResolvedValueOnce(new ObjectDefinition());

      await expect(service.create(createObjectDefinition)).rejects.toThrow(ForbiddenException);
    });

    it('should create without a description', async () => {
      const { description, ...createObjectDefinitionWithoutDescription } = createObjectDefinition;

      mockObjectDefinitionRepository.findOne.mockResolvedValueOnce(null);
      const result = await service.create(createObjectDefinitionWithoutDescription);

      expect(result.description).toBeUndefined();
    });

    it('should trim name and description', async () => {
      const trimmedCreateObjectDefinition = {
        ...createObjectDefinition,
        name: ' Not trimmed name ',
        description: ' Not trimmed description ',
      };

      mockUsersService.findOne.mockResolvedValueOnce(findOneUserResult);
      mockObjectDefinitionRepository.save.mockResolvedValueOnce({
        ...fetchedObjectDefinition[0],
        name: 'Not trimmed name',
        description: 'Not trimmed description',
      });

      const result = await service.create(trimmedCreateObjectDefinition);

      expect(result.name).toEqual(trimmedCreateObjectDefinition.name.trim());
      expect(result.description).toEqual(trimmedCreateObjectDefinition.description.trim());
    });
  });

  describe('findAll', () => {
    it('should return an array of object definitions', async () => {
      mockObjectDefinitionRepository.find.mockResolvedValue(fetchedObjectDefinition);

      const result = await service.findAll();

      expect(result).toEqual(fetchedObjectDefinition);
      expect(result.length).toEqual(fetchedObjectDefinition.length);
    });

    it('should throw an error if there is a problem fetching the object definitions', async () => {
      mockObjectDefinitionRepository.find.mockRejectedValue(new Error('Error fetching data'));

      await expect(service.findAll()).rejects.toThrow('Error fetching data');
    });

    it('should return an empty array if no object definitions are found', async () => {
      mockObjectDefinitionRepository.find.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findMany', () => {
    it('should find object definitions by a single id', async () => {
      const findObjectDefinitionDto: FindObjectDefinitionDto = { id: 1 };
      mockObjectDefinitionRepository.find.mockResolvedValue([fetchedObjectDefinition[0]]);

      const result = await service.findMany(findObjectDefinitionDto);

      expect(result).toEqual([fetchedObjectDefinition[0]]);
      expect(mockObjectDefinitionRepository.find).toHaveBeenCalledWith({
        where: { id: findObjectDefinitionDto.id },
        relations: ['createdBy', 'updatedBy', 'objectProperties'],
      });
    });

    it('should find object definitions by multiple ids', async () => {
      const findObjectDefinitionDto: FindObjectDefinitionDto = { ids: [1, 2] };
      mockObjectDefinitionRepository.find.mockResolvedValue(fetchedObjectDefinition.slice(0, 2));

      const result = await service.findMany(findObjectDefinitionDto);

      expect(result).toEqual(fetchedObjectDefinition.slice(0, 2));
      expect(mockObjectDefinitionRepository.find).toHaveBeenCalledWith({
        where: { id: In(findObjectDefinitionDto.ids) },
        relations: ['createdBy', 'updatedBy', 'objectProperties'],
      });
    });

    it('should find object definitions by name', async () => {
      const findObjectDefinitionDto: FindObjectDefinitionDto = { name: 'Rustic Small' };
      mockObjectDefinitionRepository.find.mockResolvedValue([fetchedObjectDefinition[0]]);

      const result = await service.findMany(findObjectDefinitionDto);

      expect(result).toEqual([fetchedObjectDefinition[0]]);
      expect(mockObjectDefinitionRepository.find).toHaveBeenCalledWith({
        where: { name: findObjectDefinitionDto.name },
        relations: ['createdBy', 'updatedBy', 'objectProperties'],
      });
    });

    it('should find object definitions by multiple names', async () => {
      const findObjectDefinitionDto: FindObjectDefinitionDto = {
        names: ['Rustic Small', 'Fresh Granite Movies Florida'],
      };
      mockObjectDefinitionRepository.find.mockResolvedValue(fetchedObjectDefinition.slice(0, 2));

      const result = await service.findMany(findObjectDefinitionDto);

      expect(result).toEqual(fetchedObjectDefinition.slice(0, 2));
      expect(mockObjectDefinitionRepository.find).toHaveBeenCalledWith({
        where: { name: In(findObjectDefinitionDto.names) },
        relations: ['createdBy', 'updatedBy', 'objectProperties'],
      });
    });

    it('should find object definitions by enabled status', async () => {
      const findObjectDefinitionDto: FindObjectDefinitionDto = { enabled: true };
      const enabledObjectDefinitions = fetchedObjectDefinition.filter((obj) => obj.enabled);
      mockObjectDefinitionRepository.find.mockResolvedValue(enabledObjectDefinitions);

      const result = await service.findMany(findObjectDefinitionDto);

      expect(result).toEqual(enabledObjectDefinitions);
      expect(mockObjectDefinitionRepository.find).toHaveBeenCalledWith({
        where: { enabled: findObjectDefinitionDto.enabled },
        relations: ['createdBy', 'updatedBy', 'objectProperties'],
      });
    });

    it('should find object definitions by createdById', async () => {
      const findObjectDefinitionDto: FindObjectDefinitionDto = { createdById: 78 };
      const createdByObjectDefinitions = fetchedObjectDefinition.filter(
        (obj) => obj.createdBy.id === findObjectDefinitionDto.createdById,
      );
      mockObjectDefinitionRepository.find.mockResolvedValue(createdByObjectDefinitions);

      const result = await service.findMany(findObjectDefinitionDto);

      expect(result).toEqual(createdByObjectDefinitions);
      expect(mockObjectDefinitionRepository.find).toHaveBeenCalledWith({
        where: { createdBy: { id: findObjectDefinitionDto.createdById } },
        relations: ['createdBy', 'updatedBy', 'objectProperties'],
      });
    });

    it('should find object definitions by multiple createdByIds', async () => {
      const findObjectDefinitionDto: FindObjectDefinitionDto = { createdByIds: [78, 79] };
      const createdByObjectDefinitions = fetchedObjectDefinition.filter((obj) =>
        findObjectDefinitionDto.createdByIds.includes(obj.createdBy.id),
      );
      mockObjectDefinitionRepository.find.mockResolvedValue(createdByObjectDefinitions);

      const result = await service.findMany(findObjectDefinitionDto);

      expect(result).toEqual(createdByObjectDefinitions);
      expect(mockObjectDefinitionRepository.find).toHaveBeenCalledWith({
        where: { createdBy: { id: In(findObjectDefinitionDto.createdByIds) } },
        relations: ['createdBy', 'updatedBy', 'objectProperties'],
      });
    });

    describe('update', () => {
      it('should update the object definition', async () => {
        const foundObjectDefinition = fetchedObjectDefinition[0];
        const updatedObjectDefinition = { ...fetchedObjectDefinition[0], updateObjectDefinitionDto };

        mockObjectDefinitionRepository.findOne.mockResolvedValueOnce(foundObjectDefinition).mockResolvedValueOnce(null);
        mockUsersService.findOne.mockResolvedValue(foundObjectDefinition.updatedBy);
        mockObjectDefinitionRepository.save.mockResolvedValue(updatedObjectDefinition);

        const result = await service.update(updateObjectDefinitionDto);

        expect(result).toEqual(updatedObjectDefinition);
      });
    });

    it('should update the user if the updatedById is different from the existing updatedById', async () => {
      const foundObjectDefinition = fetchedObjectDefinition[0];
      const updateUserOjectDefinitionDto = { ...updateObjectDefinitionDto, updatedById: 79 };
      const updatedObjectDefinition = { ...fetchedObjectDefinition[0], updatedById: { ...findOneUserResult, id: 79 } };

      mockObjectDefinitionRepository.findOne.mockResolvedValueOnce(foundObjectDefinition).mockResolvedValueOnce(null);
      mockUsersService.findOne.mockResolvedValue({ ...findOneUserResult, id: 79 } as User);
      mockObjectDefinitionRepository.save.mockResolvedValue(updatedObjectDefinition);

      const result = await service.update(updateUserOjectDefinitionDto);

      expect(result).toEqual(updatedObjectDefinition);
    });

    it('should throw an error if the object definition does not exist', async () => {
      mockObjectDefinitionRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.update(updateObjectDefinitionDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw a forbidden exception if the name already exists', async () => {
      mockObjectDefinitionRepository.findOne
        .mockResolvedValueOnce(fetchedObjectDefinition[1])
        .mockResolvedValueOnce(fetchedObjectDefinition[0]);

      await expect(service.update(updateObjectDefinitionDto)).rejects.toThrow(ForbiddenException);
    });

    it('should throw a not found exception if the user does not exist', async () => {
      mockObjectDefinitionRepository.findOne.mockResolvedValueOnce(fetchedObjectDefinition[0]);
      mockUsersService.findOne.mockResolvedValue(null);

      await expect(service.update(updateObjectDefinitionDto)).rejects.toThrow(NotFoundException);
    });
  });
});
