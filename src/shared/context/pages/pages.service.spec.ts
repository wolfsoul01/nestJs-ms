import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { dbConfig } from '@avantodev/avanto-shared-resources';
import { In, Repository } from 'typeorm';
import { fetchedObjectDefinition } from '../object-definitions/domain/stubs/object-definitions.stub';
import { Pages } from '@avantodev/avanto-db';
import { ObjectDefinitionsService } from '../object-definitions/object-definitions.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PageService } from './pages.service';
import { PageDto } from './domain/dtos/pages.dto';
import { createPageDto, pageStub } from './domain/stubs/pages.stub';
import { FindPageDto } from './domain/dtos/find-pages.dto';

describe('PageService', () => {
  let service: PageService;
  let mockPageRepository: jest.Mocked<Repository<Pages>>;
  let mockObjectDefinitionsService: jest.Mocked<ObjectDefinitionsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PageService,
        {
          provide: getRepositoryToken(Pages, dbConfig.name),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn().mockReturnValue(new Pages()),
            save: jest.fn().mockReturnValue(new Pages()),
            relations: jest.fn(),
          },
        },
        {
          provide: ObjectDefinitionsService,
          useValue: {
            findOne: jest.fn().mockReturnValue(fetchedObjectDefinition[0]),
          },
        },
      ],
    }).compile();

    service = module.get<PageService>(PageService);
    mockPageRepository = module.get(getRepositoryToken(Pages, dbConfig.name));
    mockObjectDefinitionsService = module.get(ObjectDefinitionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    let createPage;

    beforeEach(() => {
      createPage = { ...createPageDto };
    });

    it('should create the Page', async () => {
      mockPageRepository.findOne.mockResolvedValueOnce(null);
      mockObjectDefinitionsService.findOne.mockResolvedValueOnce(fetchedObjectDefinition[0]);

      mockPageRepository.save.mockResolvedValueOnce(pageStub);

      const result = await service.create(createPage);

      expect(result.name).toEqual(createPage.name);
      expect(result.description).toEqual(createPage.description);

      expect(result.objectDefinition.id).toEqual(createPage.objectDefinitionId);

      expect(result.id).toBeDefined();
    });

    it('should throw an error if the page name already exists for that object definition', async () => {
      mockPageRepository.findOne.mockResolvedValueOnce(pageStub);
      mockObjectDefinitionsService.findOne.mockResolvedValueOnce(fetchedObjectDefinition[0]);

      mockPageRepository.save.mockResolvedValueOnce(pageStub);

      await expect(service.create(createPage)).rejects.toThrow(BadRequestException);
    });

    it('should throw an error if the object definition does not exist', async () => {
      mockObjectDefinitionsService.findOne.mockResolvedValueOnce(null);

      await expect(service.create(createPage)).rejects.toThrow(NotFoundException);
    });

    it('should create without a description', async () => {
      const { description, ...createPageWithoutDescription } = createPage;

      mockPageRepository.findOne.mockResolvedValueOnce(null);
      const result = await service.create(createPageWithoutDescription);

      expect(result.description).toBeUndefined();
    });

    it('should trim name and description', async () => {
      const trimmedcreatePage = {
        ...createPage,
        name: ' Not trimmed name',
        description: ' Not trimmed description ',
      };

      mockObjectDefinitionsService.findOne.mockResolvedValueOnce(fetchedObjectDefinition[0]);
      mockPageRepository.save.mockResolvedValueOnce({
        ...pageStub,
        name: 'Not trimmed name',
        description: 'Not trimmed description',
      });

      const result = await service.create(trimmedcreatePage);

      expect(result.name).toEqual(trimmedcreatePage.name.trim());
      expect(result.description).toEqual(trimmedcreatePage.description.trim());
    });

    describe('findAll', () => {
      it('should return an array of pages', async () => {
        mockPageRepository.find.mockResolvedValue([pageStub]);

        const result = await service.findMany(new FindPageDto());

        expect(result).toEqual([pageStub]);
        expect(result.length).toEqual([pageStub].length);
      });

      it('should throw an error if there is a problem fetching the object definitions', async () => {
        mockPageRepository.find.mockRejectedValue(new Error('Error fetching data'));

        await expect(service.findMany(new FindPageDto())).rejects.toThrow('Error fetching data');
      });

      it('should return an empty array if no object definitions are found', async () => {
        mockPageRepository.find.mockResolvedValue([]);

        const result = await service.findMany(new FindPageDto());

        expect(result).toEqual([]);
      });
    });

    describe('findMany', () => {
      it('should find pages by ids', async () => {
        const ids = [1, 2];
        mockPageRepository.find.mockResolvedValue([pageStub]);

        const result = await service.findMany({ ids });

        expect(result).toEqual([pageStub]);
        expect(mockPageRepository.find).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { id: In(ids) },
          }),
        );
      });

      it('should find pages by names', async () => {
        const names = ['Test property'];
        mockPageRepository.find.mockResolvedValue([pageStub]);

        const result = await service.findMany({ names });

        expect(result).toEqual([pageStub]);
        expect(mockPageRepository.find).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { name: In(names) },
          }),
        );
      });

      it('should find pages by objectDefinitionIds', async () => {
        const objectDefinitionIds = [1];
        mockPageRepository.find.mockResolvedValue([pageStub]);

        const result = await service.findMany({ objectDefinitionIds });

        expect(result).toEqual([pageStub]);

        expect.objectContaining({
          where: { objectDefinitionId: In(objectDefinitionIds) },
        });
      });

      it('should find pages by combination of filters', async () => {
        const filters = {
          names: ['Test property'],
          datatypes: ['string'],
          createdByIds: [78],
        };
        mockPageRepository.find.mockResolvedValue([pageStub]);

        const result = await service.findMany(filters);

        expect(result).toEqual([pageStub]);
        expect(mockPageRepository.find).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              name: In(filters.names),
            }),
          }),
        );
      });

      it('should find page by id', async () => {
        const id = 1;
        mockPageRepository.find.mockResolvedValue([pageStub]);

        const result = await service.findMany({ id });

        expect(result).toEqual([pageStub]);
        expect(mockPageRepository.find).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { id },
          }),
        );
      });

      it('should find pages by ids', async () => {
        const ids = [1, 2];
        mockPageRepository.find.mockResolvedValue([pageStub, pageStub]);

        const result = await service.findMany({ ids });

        expect(result).toEqual([pageStub, pageStub]);
        expect(mockPageRepository.find).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { id: In(ids) },
          }),
        );
      });

      it('should find pages by name', async () => {
        const names = ['Test property'];
        mockPageRepository.find.mockResolvedValue([pageStub]);

        const result = await service.findMany({ names });

        expect(result).toEqual([pageStub]);
        expect(mockPageRepository.find).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { name: In(names) },
          }),
        );
      });

      it('should find pages by combination of filters', async () => {
        const filters = {
          ids: [1, 2],
          names: ['Test property'],
        };
        mockPageRepository.find.mockResolvedValue([pageStub, pageStub]);

        const result = await service.findMany(filters);

        expect(result).toEqual([pageStub, pageStub]);
        expect(mockPageRepository.find).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              id: In(filters.ids),
              name: In(filters.names),
            }),
          }),
        );
      });
    });

    describe('update', () => {
      let updatePageDto: PageDto;

      beforeEach(() => {
        updatePageDto = {
          id: 1,
          name: 'Updated Test pages',
          description: 'Updated description',
          objectDefinitionId: 1,
        };
      });

      it('should update a pages successfully', async () => {
        mockPageRepository.findOne.mockResolvedValueOnce(pageStub);
        mockPageRepository.findOne.mockResolvedValueOnce(null);

        mockPageRepository.save.mockResolvedValueOnce({
          ...pageStub,
          ...updatePageDto,
        });
        mockObjectDefinitionsService.findOne.mockResolvedValue(fetchedObjectDefinition[0]);
        const result = await service.update(updatePageDto);

        expect(result).toEqual({
          ...pageStub,
          ...updatePageDto,
        });
      });

      it('should throw an error if the name is already used for that object definition', async () => {
        mockPageRepository.findOne.mockResolvedValueOnce(pageStub);
        mockPageRepository.findOne.mockResolvedValueOnce(pageStub);

        mockPageRepository.save.mockResolvedValueOnce({
          ...pageStub,
          ...updatePageDto,
        });
        mockObjectDefinitionsService.findOne.mockResolvedValue(fetchedObjectDefinition[0]);
        await expect(service.update(updatePageDto)).rejects.toThrow(BadRequestException);
      });

      it('should throw NotFoundException if page does not exist', async () => {
        mockPageRepository.findOne.mockResolvedValue(null);

        await expect(service.update(updatePageDto)).rejects.toThrow(NotFoundException);
      });

      it('should throw NotFoundException if object definition does not exist', async () => {
        mockPageRepository.findOne.mockResolvedValueOnce(pageStub);
        mockPageRepository.findOne.mockResolvedValueOnce(null);

        mockObjectDefinitionsService.findOne.mockResolvedValue(null);

        await expect(service.update(updatePageDto)).rejects.toThrow(NotFoundException);
      });
    });
  });
});
