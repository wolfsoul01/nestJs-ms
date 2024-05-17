import { Test, TestingModule } from '@nestjs/testing';
import { DynamicObjectsWithValuesController } from './dynamic-objects-with-values.controller';

describe('DynamicObjectsWithValuesController', () => {
  let controller: DynamicObjectsWithValuesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DynamicObjectsWithValuesController],
    }).compile();

    controller = module.get<DynamicObjectsWithValuesController>(DynamicObjectsWithValuesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
