import { Test, TestingModule } from '@nestjs/testing';
import { DynamicObjectsController } from './dynamic-objects.controller';
import { DynamicObjectsService } from '../../shared/context/dynamic-objects/dynamic-objects.service';
import { CreateDynamicObjectDto } from '../../shared/context/dynamic-objects/domain/dtos/create-dynamic-objects.dto';
import { UpdateDynamicObjectDto } from '../../shared/context/dynamic-objects/domain/dtos/update-dynamic-objects.dto';
import { FindDynamicObjectsDto } from '../../shared/context/dynamic-objects/domain/dtos/find-dynamic-objects.dto';
import { dynamicObjectStub } from '../../shared/context/dynamic-objects/domain/stubs/dynamic-objects.stub';

describe('DynamicObjectsController', () => {
  let controller: DynamicObjectsController;
  let service: DynamicObjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DynamicObjectsController],
      providers: [
        {
          provide: DynamicObjectsService,
          useValue: {
            create: jest.fn().mockResolvedValue(dynamicObjectStub),
            update: jest.fn().mockResolvedValue(dynamicObjectStub),
            findMany: jest.fn().mockResolvedValue([dynamicObjectStub]),
          },
        },
      ],
    }).compile();

    controller = module.get<DynamicObjectsController>(DynamicObjectsController);
    service = module.get<DynamicObjectsService>(DynamicObjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a dynamic object', async () => {
    const dto = new CreateDynamicObjectDto();
    await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should update a dynamic object', async () => {
    const dto = new UpdateDynamicObjectDto();
    const id = 1; // Example ID
    await controller.update(dto);
    expect(service.update).toHaveBeenCalledWith(dto);
  });

  it('should find dynamic objects based on criteria', async () => {
    const dto = new FindDynamicObjectsDto();
    await controller.findMany(dto);
    expect(service.findMany).toHaveBeenCalledWith(dto);
  });
});
