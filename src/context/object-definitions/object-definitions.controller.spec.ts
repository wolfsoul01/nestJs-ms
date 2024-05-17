import { Test, TestingModule } from '@nestjs/testing';
import { ObjectDefinitionsController } from './object-definitions.controller';
import { ObjectDefinitionsService } from '../../shared/context/object-definitions/object-definitions.service';
import { CreateObjectDefinitionDto } from '../../shared/context/object-definitions/domain/dtos/create-object-definitions.dto';
import { UpdateObjectDefinitionDto } from '../../shared/context/object-definitions/domain/dtos/update-object-definitions.dto';
import { fetchedObjectDefinition } from '../../shared/context/object-definitions/domain/stubs/object-definitions.stub';

describe('ObjectDefinitionsController', () => {
  let controller: ObjectDefinitionsController;
  let service: ObjectDefinitionsService;

  beforeEach(async () => {
    const mockObjectDefinitionsService = {
      create: jest.fn().mockResolvedValue(fetchedObjectDefinition[0]),
      findAll: jest.fn().mockResolvedValue(fetchedObjectDefinition),
      findOne: jest.fn().mockResolvedValue(fetchedObjectDefinition[0]),
      update: jest.fn().mockResolvedValue(fetchedObjectDefinition[0]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObjectDefinitionsController],
      providers: [
        {
          provide: ObjectDefinitionsService,
          useValue: mockObjectDefinitionsService,
        },
      ],
    }).compile();

    controller = module.get<ObjectDefinitionsController>(ObjectDefinitionsController);
    service = module.get<ObjectDefinitionsService>(ObjectDefinitionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new object definition', async () => {
    const dto: CreateObjectDefinitionDto = new CreateObjectDefinitionDto();
    await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should fetch all object definitions', async () => {
    await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should fetch a single object definition by id', async () => {
    const id = 1;
    await controller.findOne(id);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('should update an object definition', async () => {
    const dto: UpdateObjectDefinitionDto = new UpdateObjectDefinitionDto();
    await controller.update(dto);
    expect(service.update).toHaveBeenCalledWith(dto);
  });
});
