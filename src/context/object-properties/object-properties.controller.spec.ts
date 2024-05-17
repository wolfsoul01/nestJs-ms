import { Test, TestingModule } from '@nestjs/testing';
import { ObjectPropertiesController } from './object-properties.controller';
import { ObjectPropertiesService } from '../../shared/context/object-properties/object-properties.service';
import { CreateObjectPropertyDto } from '../../shared/context/object-properties/domain/dtos/create-object-properties.dto';
import { UpdateObjectPropertyDto } from '../../shared/context/object-properties/domain/dtos/update-object-properties.dto';
import { FindObjectPropertiesDto } from '../../shared/context/object-properties/domain/dtos/find-object-properties.dto';
import { objectPropertyStub } from '../../shared/context/object-properties/domain/stubs/object-properties.stub';

describe('ObjectPropertiesController', () => {
  let controller: ObjectPropertiesController;
  let service: ObjectPropertiesService;

  beforeEach(async () => {
    const mockObjectPropertiesService = {
      provide: ObjectPropertiesService,
      useFactory: () => ({
        create: jest.fn().mockResolvedValue(objectPropertyStub),
        findMany: jest.fn().mockResolvedValue([objectPropertyStub]),
        findOne: jest.fn().mockResolvedValue(objectPropertyStub),
        update: jest.fn().mockResolvedValue(objectPropertyStub),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObjectPropertiesController],
      providers: [mockObjectPropertiesService],
    }).compile();

    controller = module.get<ObjectPropertiesController>(ObjectPropertiesController);
    service = module.get<ObjectPropertiesService>(ObjectPropertiesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create method with expected params', async () => {
    const createDto = new CreateObjectPropertyDto();
    await controller.create(createDto);
    expect(service.create).toHaveBeenCalledWith(createDto);
  });

  it('should call findMany method with expected params', async () => {
    const findManyDto = new FindObjectPropertiesDto();
    await controller.findMany(findManyDto);
    expect(service.findMany).toHaveBeenCalledWith(findManyDto);
  });

  it('should call update method with expected params', async () => {
    const updateDto = new UpdateObjectPropertyDto();
    updateDto.id = 1; // Assuming id is needed but not available in constructor
    await controller.update(updateDto);
    expect(service.update).toHaveBeenCalledWith(updateDto);
  });
});
