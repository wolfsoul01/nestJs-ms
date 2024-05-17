import { Test, TestingModule } from '@nestjs/testing';
import { ObjectValuesController } from './object-values.controller';
import { ObjectValuesService } from '../../shared/context/object-values/object-values.service';
import { CreateObjectValueDto } from '../../shared/context/object-values/domain/dtos/create-object-values.dto';
import { UpdateObjectValueDto } from '../../shared/context/object-values/domain/dtos/update-object-values.dto';
import { FindObjectValueDto } from '../../shared/context/object-values/domain/dtos/find-object-values.dto';
import { objectValuesStub } from '../../shared/context/object-values/domain/stubs/object-values.stub';

describe('ObjectValuesController', () => {
  let controller: ObjectValuesController;
  let service: ObjectValuesService;

  beforeEach(async () => {
    const mockObjectValuesService = {
      provide: ObjectValuesService,
      useFactory: () => ({
        create: jest.fn().mockResolvedValue(objectValuesStub),
        findMany: jest.fn().mockResolvedValue([objectValuesStub]),
        findOne: jest.fn().mockResolvedValue(objectValuesStub),
        update: jest.fn().mockResolvedValue(objectValuesStub),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObjectValuesController],
      providers: [mockObjectValuesService],
    }).compile();

    controller = module.get<ObjectValuesController>(ObjectValuesController);
    service = module.get<ObjectValuesService>(ObjectValuesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create method with expected params', async () => {
    const createDto = new CreateObjectValueDto();
    await controller.create(createDto);
    expect(service.create).toHaveBeenCalledWith(createDto);
  });

  it('should call findMany method with expected params', async () => {
    const findManyDto = new FindObjectValueDto();
    await controller.findAll(findManyDto);
    expect(service.findMany).toHaveBeenCalledWith(findManyDto);
  });

  it('should call findOne method with expected params', async () => {
    const tag = 'some-tag';
    await controller.findOne(tag);
    expect(service.findOne).toHaveBeenCalledWith(tag);
  });

  it('should call update method with expected params', async () => {
    const updateDto = new UpdateObjectValueDto();
    await controller.update(updateDto);
    expect(service.update).toHaveBeenCalledWith(updateDto);
  });
});
